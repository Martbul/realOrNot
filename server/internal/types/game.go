package types

import (
	"github.com/gorilla/websocket"
)

type Player struct {
	ID       string          // Unique identifier for the player
	Conn     *websocket.Conn // WebSocket connection for real-time updates
	Username string          // Optional: Player's display name
	Score    int             // Player's score, initialized to 0
	// IsReady  bool            // Indicates if the player is ready for the next round
}

type Round struct {
	Img1URL string `db:"img_1_url" json:"img_1_url"`
	Img2URL string `db:"img_2_url" json:"img_2_url"`
	Correct string `db:"correct" json:"correct"`
}
