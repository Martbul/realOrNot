package matchmaker

import (
	"sync"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
)

type Matchmaker struct {
	queue      []*types.Player
	minPlayers int
	mu         sync.Mutex
	dbConn     *sqlx.DB
}

// NewMatchmaker initializes a new Matchmaker
func NewMatchmaker(minPlayers int, dbConn *sqlx.DB) *Matchmaker {
	return &Matchmaker{
		queue:      []*types.Player{},
		minPlayers: minPlayers,
		dbConn:     dbConn,
	}
}

// AddPlayer adds a player to the queue and creates a session if the minimum players threshold is met
func (m *Matchmaker) AddPlayer(player *types.Player) (*types.Session, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.queue = append(m.queue, player)

	// If enough players are in the queue, create a new session
	if len(m.queue) >= m.minPlayers {
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:] // Remove players from the queue

		// Create a new session
		newSession := &types.Session{
			Players: make([]string, len(players)),
			Status:  "active",
		}

		for i, p := range players {
			newSession.Players[i] = p.ID
		}

		// Persist the session to the database
		err := db.CreateSession(m.dbConn, newSession)
		if err != nil {
			return nil, err
		}

		return newSession, nil
	}
	return nil, nil
}
