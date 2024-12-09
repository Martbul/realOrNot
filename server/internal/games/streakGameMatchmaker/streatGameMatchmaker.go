package streakGameMatchmaker

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/games/streakGameSession"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

type StreakGameMatchmaker struct {
	Sessions map[string]*streakGameSession.StreakGameSession
}

func NewStreakGameMatchmaker() *StreakGameMatchmaker {
	return &StreakGameMatchmaker{
		Sessions: make(map[string]*streakGameSession.StreakGameSession),
	}
}

func (sgm *StreakGameMatchmaker) LoadingStreakGame(player *types.Player, dbConn *sqlx.DB) (*streakGameSession.StreakGameSession, error) {

	log := logger.GetLogger()
	if err := player.Conn.WriteJSON(map[string]string{
		"status":  "Loading",
		"message": "Loading resources. Game starts soon...",
	}); err != nil {
		log.Error("Error sending queue status to player:", err)
		return nil, err
	}

	newStreakGameSession := streakGameSession.NewStreakGameSession(player)
	sgm.Sessions[newStreakGameSession.ID] = newStreakGameSession

	//go sgm.RunStreakGameSession(newStreakGameSession, dbConn)
	sgm.RunStreakGameSession(newStreakGameSession, dbConn)

	return newStreakGameSession, nil
}

func (sgm *StreakGameMatchmaker) RunStreakGameSession(sess *streakGameSession.StreakGameSession, dbConn *sqlx.DB) {
	fmt.Println("here3")

	if sess.Player.Conn != nil {
		sess.Player.Conn.WriteJSON(map[string]string{
			"status":  "game_start",
			"message": "The game is starting now!",
			"session": sess.ID,
		})

	}

	var score int

	rightGuess := true

	for rightGuess {

		round, err := db.GetRound(dbConn)
		//WARN: Improve error handling
		if err != nil {
			fmt.Println("get rounds error")
		}

		if sess.Player.Conn != nil {
			sess.Player.Conn.WriteJSON(map[string]interface{}{
				"round":     round,
				"message":   fmt.Sprintf("Round %d is starting now!"),
				"roundData": round,
			})
		}

		guesses := make(chan struct {
			PlayerID string
			Guess    string
		})
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second) // 15 seconds to guess
		defer cancel()

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
		}(sess.Player)

		// Process guesses with a timeout
		receivedGuesses := 0
		for {
			select {
			case guess := <-guesses:
				if guess.Guess == round.Correct {
					score++
				} else {
					rightGuess = false
				}
				receivedGuesses++
				if receivedGuesses == 1 {
					cancel() // Stop waiting if all players have guessed
				}
			case <-ctx.Done():
				// Timeout reached, proceed to the next round
				break
			}

			if receivedGuesses == 1 || ctx.Err() != nil {
				// Exit the loop if all guesses are received or timeout occurs
				break
			}
		}
	}

	sgm.EndStreakGameSession(sess, score, dbConn)
}

func (sgm *StreakGameMatchmaker) EndStreakGameSession(sess *streakGameSession.StreakGameSession, score int, dbConn *sqlx.DB) {
	fmt.Println("here4")
	delete(sgm.Sessions, sess.ID) // Remove session from in-memory storage

	//db.AddPlayerWin(dbConn, w)

	if sess.Player.Conn != nil {
		sess.Player.Conn.WriteJSON(map[string]interface{}{
			"status":  "game_end",
			"message": "The game has ended. Thanks for playing!",
			"scores":  score,
		})
	}
}
