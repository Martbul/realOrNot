package game

type Player struct {
	ID   string
	Conn *websocket.Conn // WebSocket connection for real-time updates
}

type Session struct {
	ID      string
	Players []*Player
	Rounds  []Round
}

type Round struct {
	ImageURL string
	Answer   bool // True if real, False if fake
}
