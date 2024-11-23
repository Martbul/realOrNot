package session

import (
	"time"

	"github.com/google/uuid"
	"github.com/martbul/realOrNot/internal/types"
)

type Session struct {
	ID        string          `db:"session_id"`
	Players   []*types.Player `db:"players"`
	Rounds    []types.Round   `db:"rounds"`
	Status    string          `db:"status"`
	CreatedAt time.Time       `db:"created_at"`
	ExpiresAt time.Time       `db:"expires_at"`
}

func NewSession(players []*types.Player) *Session {
	return &Session{
		ID:        uuid.New().String(),           // Generate a unique session ID
		Players:   players,                       // Assign provided players
		Rounds:    []types.Round{},               // Initialize with an empty round list
		Status:    "waiting",                     // Default status is "waiting"
		CreatedAt: time.Now(),                    // Current timestamp
		ExpiresAt: time.Now().Add(1 * time.Hour), // Set expiration to 1 hour from now
	}
}
