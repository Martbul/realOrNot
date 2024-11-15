package session

import (
	"fmt"
	"time"

	"github.com/martbul/realOrNot/internal/game"
)

type Session struct {
	ID      string
	Players []*game.Player
	Rounds  []game.Round
}

func NewSession(players []*game.Player) *Session {
	return &Session{
		ID:      game.GenerateSessionID(),
		Players: players,
		Rounds:  game.GenerateRounds(),
	}
}

func (s *Session) Start() {
	for roundIndex, round := range s.Rounds {
		for _, player := range s.Players {
			player.Conn.WriteJSON(map[string]interface{}{
				"status":     "round_start",
				"round":      roundIndex + 1,
				"real_image": round.RealImageURL,
				"fake_image": round.FakeImageURL,
				"message":    "Select the real image!",
			})
		}

		playerResponses := make(map[string]string)
		responseChan := make(chan map[string]string, len(s.Players))

		go func() {
			for _, player := range s.Players {
				var response struct {
					PlayerID string `json:"player_id"`
					Guess    string `json:"guess"`
				}
				if err := player.Conn.ReadJSON(&response); err == nil {
					responseChan <- map[string]string{response.PlayerID: response.Guess}
				}
			}
		}()

		timeout := time.After(10 * time.Second)
		for i := 0; i < len(s.Players); i++ {
			select {
			case resp := <-responseChan:
				for k, v := range resp {
					playerResponses[k] = v
				}
			case <-timeout:
				break
			}
		}

		for playerID, guess := range playerResponses {
			correct := guess == round.Correct
			for _, player := range s.Players {
				if player.ID == playerID {
					player.Conn.WriteJSON(map[string]interface{}{
						"status":  "round_result",
						"correct": correct,
						"message": fmt.Sprintf("Your guess was %v!", correct),
					})
				}
			}
		}

		time.Sleep(5 * time.Second)
	}
}
