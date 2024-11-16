package types

import (
	"time"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID       string          // Unique identifier for the player
	Conn     *websocket.Conn // WebSocket connection for real-time updates
	Username string          // Optional: Player's display name
	Score    int             // Player's score, initialized to 0
	IsReady  bool            // Indicates if the player is ready for the next round
}

type Session struct {
	ID        string    `db:"session_id"`
	Players   []string  `db:"players"`
	Rounds    []Round   `db:"rounds"`
	Status    string    `db:"status"`
	CreatedAt time.Time `db:"created_at"`
	ExpiresAt time.Time `db:"expires_at"`
}

type Round struct {
	RealImageURL string `json:"real_image_url"`
	FakeImageURL string `json:"fake_image_url"`
	Correct      string `json:"correct"`
}
