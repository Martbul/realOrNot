// matchmaker.go
package matchmaker

import (
	"sync"

	"github.com/martbul/realOrNot/internal/game"
	"github.com/martbul/realOrNot/internal/game/session"
)

type Matchmaker struct {
	queue      []*game.Player
	minPlayers int
	mu         sync.Mutex
}

func NewMatchmaker(minPlayers int) *Matchmaker {
	return &Matchmaker{
		queue:      []*game.Player{},
		minPlayers: minPlayers,
	}
}

func (m *Matchmaker) AddPlayer(player *game.Player) *session.Session {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.queue = append(m.queue, player)

	if len(m.queue) >= m.minPlayers {
		// Start a session with minPlayers and clear them from the queue
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:]
		return session.NewSession(players)
	}
	return nil
}
