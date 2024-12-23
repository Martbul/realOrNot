package duelMatchmaker

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/games/duelSession"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

type Matchmaker struct {
	Mu           sync.Mutex
	queue        []*types.Player
	Sessions     map[string]*duelSession.DuelSession
	minPlayers   int
	PlayerStates sync.Map // map[playerID]bool (true = in game, false = waiting)
}

func NewDuelMatchmaker(minPlayers int) *Matchmaker {
	return &Matchmaker{
		queue:      []*types.Player{},
		Sessions:   make(map[string]*duelSession.DuelSession),
		minPlayers: minPlayers,
	}
}

func (m *Matchmaker) DuelQueuePlayer(player *types.Player, dbConn *sqlx.DB) (*duelSession.DuelSession, error) {
	log := logger.GetLogger()
	m.Mu.Lock()
	defer m.Mu.Unlock()

	m.queue = append(m.queue, player)

	m.PlayerStates.Store(player.ID, false)

	if err := player.Conn.WriteJSON(map[string]string{
		"status":  "queued",
		"message": "You have been added to the queue. Waiting for more players...",
	}); err != nil {
		log.Error("Error sending queue status to player:", err)
		return nil, err
	}

	if len(m.queue) >= m.minPlayers {
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:]

		newSession := duelSession.NewDuelSession(players)
		m.Sessions[newSession.ID] = newSession // Add to in-memory sessions

		for _, p := range players {
			m.PlayerStates.Store(p.ID, true)
		}

		for _, p := range players {
			go func(player *types.Player, session *duelSession.DuelSession) {
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

		go m.DuelStartSession(newSession, dbConn)

		return newSession, nil
	}

	return nil, nil
}

func (m *Matchmaker) DuelStartSession(sess *duelSession.DuelSession, db *sqlx.DB) {

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

	go m.duelrunGame(sess, db)
}

func (m *Matchmaker) duelrunGame(sess *duelSession.DuelSession, dbConn *sqlx.DB) {
	fmt.Println("sessPlayers", sess.Players)

	scores := make(map[string]int)
	for _, p := range sess.Players {
		if p.ID == "" {
			fmt.Println("Player with empty ID found:", p)
			continue
		}
		scores[p.ID] = 0
	}

	//TODO: Improve error handling
	gameRounds, err := db.GetRandomRounds(dbConn)
	if err != nil {
		fmt.Println("get rounds error")
	}
	for round := 1; round <= 5; round++ {
		roundData := gameRounds[round-1]

		for _, p := range sess.Players {
			if p.Conn != nil {
				p.Conn.WriteJSON(map[string]interface{}{
					"round":     round,
					"message":   fmt.Sprintf("Round %d is starting now!", round),
					"roundData": roundData,
				})
			}
		}

		guesses := make(chan struct {
			PlayerID string
			Guess    string
		})
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second) // 15 seconds to guess
		defer cancel()

		// Read guesses asynchronously
		for _, p := range sess.Players {
			go func(player *types.Player) {
				var guess struct {
					PlayerID string `json:"player_id"`
					Guess    string `json:"guess"`
				}
				err := player.Conn.ReadJSON(&guess)
				if err == nil {
					guesses <- struct {
						PlayerID string
						Guess    string
					}{
						PlayerID: guess.PlayerID,
						Guess:    guess.Guess,
					}
				}
			}(p)
		}

		// Process guesses with a timeout
		receivedGuesses := 0
		for {
			select {
			case guess := <-guesses:
				if guess.Guess == roundData.Correct {
					scores[guess.PlayerID]++
				}
				receivedGuesses++
				if receivedGuesses == len(sess.Players) {
					cancel() // Stop waiting if all players have guessed
				}
			case <-ctx.Done():
				// Timeout reached, proceed to the next round
				break
			}

			if receivedGuesses == len(sess.Players) || ctx.Err() != nil {
				// Exit the loop if all guesses are received or timeout occurs
				break
			}
		}
	}

	m.duelEndSession(sess, scores, dbConn)
}

func (m *Matchmaker) duelEndSession(sess *duelSession.DuelSession, scores map[string]int, dbConn *sqlx.DB) {
	m.Mu.Lock()
	defer m.Mu.Unlock()

	delete(m.Sessions, sess.ID) // Remove session from in-memory storage
	var highestScore int
	var winners []string
	var winnersId []string
	for playerID, score := range scores {
		if score > highestScore {
			highestScore = score
			playerW, err := db.GetUserById(dbConn, playerID)
			//TODO: Improve error handling
			if err != nil {
				fmt.Println("Unable to get user")
			}
			winners = []string{playerW.UserName}
			winnersId = []string{playerID}
		} else if score == highestScore {
			playerW, err := db.GetUserById(dbConn, playerID)
			//TODO: Improve error handling
			if err != nil {
				fmt.Println("Unable to get user")
			}

			winnersId = append(winnersId, playerID)
			winners = append(winners, playerW.UserName)
		}

	}

	for _, w := range winnersId {
		db.AddPlayerWin(dbConn, w)
	}

	for _, p := range sess.Players {

		if p.Conn != nil {
			p.Conn.WriteJSON(map[string]interface{}{
				"status":  "game_end",
				"message": "The game has ended. Thanks for playing!",
				"scores":  scores,
				"winners": winners,
			})
		}
	}
}
