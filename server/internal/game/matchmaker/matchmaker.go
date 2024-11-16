package matchmaker

import (
	"fmt"
	"sync"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/internal/util"
)

type Matchmaker struct {
	queue      []*types.Player
	minPlayers int
	mu         sync.Mutex
	dbConn     *sqlx.DB
}

func NewMatchmaker(minPlayers int, dbConn *sqlx.DB) *Matchmaker {
	return &Matchmaker{
		queue:      []*types.Player{},
		minPlayers: minPlayers,
		dbConn:     dbConn,
	}
}

// AddPlayer adds a player to the queue and creates a session if the minimum players threshold is met
func (m *Matchmaker) QueuePlayer(player *types.Player) (*types.Session, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.queue = append(m.queue, player)
	fmt.Println(player)
	// If enough players are in the queue, create a new session
	if len(m.queue) >= m.minPlayers {
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:] // Remove players from the queue

		newSession := util.CreateNewSession(players)

		for i, p := range players {
			newSession.Players[i] = p
		}

		// Persist the session to the database
		err := db.CreateSession(m.dbConn, newSession)
		if err != nil {
			fmt.Println("error creating session`")
			return nil, err
		}

		return newSession, nil
	}
	return nil, nil
}
