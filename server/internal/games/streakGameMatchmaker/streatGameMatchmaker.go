package streakGameMatchmaker

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/games/streakGameSession"
	"github.com/martbul/realOrNot/internal/types"
)

type StreakGameMatchmaker struct {
	Sessions map[string]*streakGameSession.StreakGameSession
}

func NewStreakGameMatchmaker() *StreakGameMatchmaker {
	return &StreakGameMatchmaker{
		Sessions: make(map[string]*streakGameSession.StreakGameSession),
	}
}

func (sgm *StreakGameMatchmaker) LoadingStreakGame(player *types.Player, dbConn *sqlx.DB) *streakGameSession.StreakGameSession {
	newStreakGameSession := streakGameSession.NewStreakGameSession(player)
	sgm.Sessions[newStreakGameSession.ID] = newStreakGameSession // Add to in-memory sessions

	go sgm.RunStreakGameSession(newStreakGameSession, dbConn)

	return newStreakGameSession
}

func (sgm *StreakGameMatchmaker) RunStreakGameSession(sess *streakGameSession.StreakGameSession, dbConn *sqlx.DB) {
	scores := make(map[string]int)
	for _, p := range sess.Players {
		if p.ID == "" {
			fmt.Println("Player with empty ID found:", p)
			continue
		}
		scores[p.ID] = 0
	}

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

func (sgm *StreakGameMatchmaker) EndStreakGameSession(sess *streakGameSession.StreakGameSession, scores map[string]int, dbConn *sqlx.DB) {
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
