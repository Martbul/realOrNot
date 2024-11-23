package matchmaker

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/martbul/realOrNot/internal/game"
	"github.com/martbul/realOrNot/internal/game/session"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

type Matchmaker struct {
	Mu         sync.Mutex
	queue      []*types.Player
	Sessions   map[string]*session.Session
	minPlayers int
	// Shared map to track if players are in an active game
	PlayerStates sync.Map // map[playerID]bool (true = in game, false = waiting)
}

func NewMatchmaker(minPlayers int) *Matchmaker {
	return &Matchmaker{
		queue:      []*types.Player{},
		Sessions:   make(map[string]*session.Session),
		minPlayers: minPlayers,
	}
}

func (m *Matchmaker) QueuePlayer(player *types.Player) (*session.Session, error) {
	log := logger.GetLogger()
	m.Mu.Lock()
	defer m.Mu.Unlock()

	m.queue = append(m.queue, player)

	// Mark player as waiting
	m.PlayerStates.Store(player.ID, false)

	// Inform the player that they are in the queue
	if err := player.Conn.WriteJSON(map[string]string{
		"status":  "queued",
		"message": "You have been added to the queue. Waiting for more players...",
	}); err != nil {
		log.Error("Error sending queue status to player:", err)
		return nil, err
	}

	// Check if enough players are in the queue to start a session
	if len(m.queue) >= m.minPlayers {
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:]

		// Create a new session
		newSession := session.NewSession(players)
		m.Sessions[newSession.ID] = newSession // Add to in-memory sessions

		// Mark players as in-game
		for _, p := range players {
			m.PlayerStates.Store(p.ID, true)
		}

		// Notify players about the game session start
		for _, p := range players {
			go func(player *types.Player, session *session.Session) {
				if player.Conn != nil {
					err := player.Conn.WriteJSON(map[string]string{
						"status":  "game_found",
						"session": session.ID,
						"message": "Game session will start soon!",
					})
					if err != nil {
						log.Error("Error notifying player:", err)
					}
				}
			}(p, newSession)
		}

		go m.StartSession(newSession)

		return newSession, nil
	}

	// Return nil if not enough players, but the player is still in the queue
	return nil, nil
}

func (m *Matchmaker) StartSession(sess *session.Session) {
	time.Sleep(5 * time.Second)

	m.Mu.Lock()
	sess.Status = "active"
	m.Mu.Unlock()

	for _, p := range sess.Players {
		if p.Conn != nil {
			p.Conn.WriteJSON(map[string]string{
				"status":  "game_start",
				"message": "The game is starting now!",
				"rounds":  "5",
			})

		}
	}

	go m.runGame(sess)
}

func (m *Matchmaker) runGame(sess *session.Session) {

	log := logger.GetLogger()
	// Initialize player scores
	scores := make(map[string]int)
	for _, p := range sess.Players {
		scores[p.ID] = 0
	}

	// Simulate game rounds
	for round := 1; round <= 5; round++ {

		roundData := game.Generate5Rounds()
		if round != 1 {

			time.Sleep(10 * time.Second) // Simulate round duration
		}
		// Notify players of the next round
		players := []*types.Player{}
		for _, p := range sess.Players {
			players = append(players, p)
			if p.Conn != nil {
				p.Conn.WriteJSON(map[string]interface{}{
					"round":     round,
					"message":   fmt.Sprintf("Round %d is starting now!", round),
					"roundData": roundData,
					"players":   players,
				})
			}
		}

		// Wait for player guesses
		guesses := make(chan struct {
			PlayerID string
			Guess    string
		})

		// Read guesses asynchronously
		for _, p := range sess.Players {
			go func(player *types.Player) {
				var guess struct {
					PlayerID string `json:"player_id"`
					Guess    string `json:"guess"`
				}

				if err := player.Conn.ReadJSON(&guess); err == nil {
					guesses <- struct {
						PlayerID string
						Guess    string
					}{PlayerID: player.ID, Guess: guess.Guess}
				}
			}(p)
		}

		// Process guesses
		//	guessTime := time.After(15 * time.Second)
		receivedGuesses := 0
		for receivedGuesses < len(sess.Players) {
			select {
			case guess := <-guesses:
				if guess.Guess == roundData.Correct {
					scores[guess.PlayerID]++
				}
				receivedGuesses++
				//		case <-guessTime:
				//			log.Info("Time ended, proceeding to the next.")
				//			break
			}
		}
	}

	//BUG:  The code got the the 5 round but did not envoked the endSession func
	//BUG: This error is not consistent!!! /possible race condittion!/
	log.Debug("Run game was executed!")
	m.endSession(sess, scores)
}

func (m *Matchmaker) endSession(sess *session.Session, scores map[string]int) {

	log := logger.GetLogger()
	m.Mu.Lock()

	defer m.Mu.Unlock()

	delete(m.Sessions, sess.ID) // Remove session from in-memory storage
	log.Debug("Ending session")
	// Determine the winner(s)
	var highestScore int
	var winners []string
	for playerID, score := range scores {
		if score > highestScore {
			highestScore = score
			winners = []string{playerID}
		} else if score == highestScore {
			winners = append(winners, playerID)
		}
	}

	log.Debug("winner determined")
	for _, p := range sess.Players {

		log.Debug("Sending end game stats in ws")
		if p.Conn != nil {
			p.Conn.WriteJSON(map[string]interface{}{
				"status":  "game_end",
				"message": "The game has ended. Thanks for playing!",
				"scores":  scores,
				"winner":  winners,
			})
		}
	}
}
