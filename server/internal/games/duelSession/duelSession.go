package duelSession

import (
	"time"

	"github.com/google/uuid"
	"github.com/martbul/realOrNot/internal/types"
)

type DuelSession struct {
	ID        string          `db:"session_id"`
	Players   []*types.Player `db:"players"`
	Rounds    []types.Round   `db:"rounds"`
	Status    string          `db:"status"`
	CreatedAt time.Time       `db:"created_at"`
	ExpiresAt time.Time       `db:"expires_at"`
}

func NewDuelSession(players []*types.Player) *DuelSession {
	return &DuelSession{
		ID:        uuid.New().String(),
		Players:   players,
		Rounds:    []types.Round{},
		Status:    "waiting",
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}
}
