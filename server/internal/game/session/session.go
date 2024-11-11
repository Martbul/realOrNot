// session.go
package session

import (
	"github.com/martbul/realOrNot/internal/game"
	"time"
)

type Session struct {
	ID      string
	Players []*game.Player
	Rounds  []game.Round
}

func NewSession(players []*game.Player) *Session {
	return &Session{
		ID:      game.GenerateSessionID(), // Generate a unique session ID
		Players: players,
		Rounds:  game.GenerateRounds(),
	}
}

func (s *Session) Start() {
	for _, round := range s.Rounds {
		for _, player := range s.Players {
			// Send each player the current round's image (over WebSocket)
			sendRoundToPlayer(player, round)
		}
		time.Sleep(5 * time.Second) // Delay between rounds
	}
}
