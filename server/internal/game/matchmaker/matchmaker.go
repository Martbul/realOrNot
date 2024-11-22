package matchmaker

import (
	"fmt"
	"sync"
	"time"

	"github.com/martbul/realOrNot/internal/game/session"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

var correctAnswers = map[int]string{
	1: "https://example.com/round_1_real_image.jpg",
	2: "https://example.com/round_2_real_image.jpg",
	3: "https://example.com/round_3_real_image.jpg",
	4: "https://example.com/round_4_real_image.jpg",
	5: "https://example.com/round_5_real_image.jpg",
}

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

		// Start the game after 5 seconds
		go m.StartSession(newSession)

		return newSession, nil
	}

	// Return nil if not enough players, but the player is still in the queue
	return nil, nil
}

// startSession initializes the session after a delay
func (m *Matchmaker) StartSession(sess *session.Session) {
	time.Sleep(5 * time.Second) // Delay before starting

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

	//	log := logger.GetLogger()
	// Initialize player scores
	scores := make(map[string]int)
	for _, p := range sess.Players {
		scores[p.ID] = 0
	}

	// Simulate game rounds
	for round := 1; round <= 2; round++ {
		time.Sleep(10 * time.Second) // Simulate round duration
		// Notify players of the next round
		players := []*types.Player{}
		for _, p := range sess.Players {
			players = append(players, p)
			if p.Conn != nil {
				p.Conn.WriteJSON(map[string]interface{}{
					"round":     round,
					"message":   fmt.Sprintf("Round %d is starting now!", round),
					"image_url": fmt.Sprintf("https://example.com/round_%d_image.jpg", round),
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
		//timeout := time.After(15 * time.Second) // Allow 15 seconds for guesses
		receivedGuesses := 0
		for receivedGuesses < len(sess.Players) {
			select {
			case guess := <-guesses:
				if guess.Guess == correctAnswers[round] {
					scores[guess.PlayerID]++
				}
				receivedGuesses++
				//case <-timeout:
				//	log.Info("Round ended, proceeding to the next.")
				//	break
			}
		}
	}

	// End the session
	m.endSession(sess, scores)
}

func (m *Matchmaker) endSession(sess *session.Session, scores map[string]int) {
	m.Mu.Lock()
	defer m.Mu.Unlock()

	delete(m.Sessions, sess.ID) // Remove session from in-memory storage

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

	for _, p := range sess.Players {
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
