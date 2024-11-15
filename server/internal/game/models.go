package game

import (
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
	ID      string
	Players []*Player
	Rounds  []Round
}

type Round struct {
	RealImageURL string // URL of the real image
	FakeImageURL string // URL of the fake image
	Correct      string // The correct answer ("real" or "fake")
}
