package streakGameSession

import (
	"time"

	"github.com/google/uuid"
	"github.com/martbul/realOrNot/internal/types"
)

type StreakGameSession struct {
	ID        string        `db:"streak_game_session_id"`
	Player    *types.Player `db:"player"`
	Rounds    []types.Round `db:"rounds"`
	Status    string        `db:"status"`
	CreatedAt time.Time     `db:"created_at"`
	ExpiresAt time.Time     `db:"expires_at"`
}

func NewStreakGameSession(player *types.Player) *StreakGameSession {
	return &StreakGameSession{
		ID:        uuid.New().String(),           // Generate a unique session ID
		Player:    player,                        // Assign provided players
		Rounds:    []types.Round{},               // Initialize with an empty round list
		Status:    "waiting",                     // Default status is "waiting"
		CreatedAt: time.Now(),                    // Current timestamp
		ExpiresAt: time.Now().Add(1 * time.Hour), // Set expiration to 1 hour from now
	}
}
