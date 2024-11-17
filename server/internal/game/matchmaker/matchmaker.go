package matchmaker

import (
	"fmt"
	"sync"
	"time"

	"github.com/martbul/realOrNot/internal/game/session"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

type Matchmaker struct {
	queue      []*types.Player
	Sessions   map[string]*session.Session // In-memory session storage
	minPlayers int
	Mu         sync.Mutex
}

func NewMatchmaker(minPlayers int) *Matchmaker {
	return &Matchmaker{
		queue:      []*types.Player{},
		Sessions:   make(map[string]*session.Session),
		minPlayers: minPlayers,
	}
}

func (m *Matchmaker) QueuePlayer(player *types.Player) (*session.Session, error) {
	log := logger.GetLogger()
	m.Mu.Lock()
	defer m.Mu.Unlock()

	m.queue = append(m.queue, player)

	// Inform the player that they are in the queue
	if err := player.Conn.WriteJSON(map[string]string{
		"status":  "queued",
		"message": "You have been added to the queue. Waiting for more players...",
	}); err != nil {
		log.Error("Error sending queue status to player:", err)
		return nil, err
	}

	// Check if enough players are in the queue to start a session
	if len(m.queue) >= m.minPlayers {
		players := m.queue[:m.minPlayers]
		m.queue = m.queue[m.minPlayers:]

		// Create a new session
		newSession := session.NewSession(players)
		m.Sessions[newSession.ID] = newSession // Add to in-memory sessions

		// Notify players about the game session start
		for _, p := range players {
			go func(player *types.Player, session *session.Session) {
				if player.Conn != nil {
					err := player.Conn.WriteJSON(map[string]string{
						"status":  "game_found",
						"session": session.ID,
						"message": "Game session will start soon!",
					})
					if err != nil {
						log.Error("Error notifying player:", err)
					}
				}
			}(p, newSession)
		}

		// Start the game after 5 seconds
		go m.StartSession(newSession)

		return newSession, nil
	}

	// Return nil if not enough players, but the player is still in the queue
	return nil, nil
}

// startSession initializes the session after a delay
func (m *Matchmaker) StartSession(sess *session.Session) {
	time.Sleep(5 * time.Second) // Delay before starting

	m.Mu.Lock()
	sess.Status = "active"
	m.Mu.Unlock()

	// Notify players the game is starting
	for _, p := range sess.Players {
		if p.Conn != nil {
			p.Conn.WriteJSON(map[string]string{
				"status":  "game_start",
				"message": "The game is starting now!",
				"rounds":  "5",
			})

			// Simulate sending an image for the game (replace with real game data)
			p.Conn.WriteJSON(map[string]interface{}{
				"image_url": "https://example.com/game_image.jpg",
				"message":   "Round 1 starts now!",
			})
		}
	}

	// Simulate the game lifecycle
	go m.runGame(sess)
}

// runGame manages the game rounds (placeholder for actual game logic)
func (m *Matchmaker) runGame(sess *session.Session) {
	for i := 1; i <= 5; i++ {
		time.Sleep(30 * time.Second) // Simulate round duration

		// Notify players of the next round
		for _, p := range sess.Players {
			if p.Conn != nil {
				p.Conn.WriteJSON(map[string]interface{}{
					"round":     i,
					"message":   fmt.Sprintf("Round %d is starting now!", i),
					"image_url": fmt.Sprintf("https://example.com/round_%d_image.jpg", i),
				})
			}
		}
	}

	// End the session
	m.endSession(sess)
}

// endSession cleans up the session and notifies players
func (m *Matchmaker) endSession(sess *session.Session) {
	m.Mu.Lock()
	defer m.Mu.Unlock()

	delete(m.Sessions, sess.ID) // Remove session from in-memory storage

	for _, p := range sess.Players {
		if p.Conn != nil {
			p.Conn.WriteJSON(map[string]string{
				"status":  "game_end",
				"message": "The game has ended. Thanks for playing!",
			})
		}
	}
}

//type Matchmaker struct {
//	queue      []*types.Player
//	minPlayers int
//	mu         sync.Mutex
//	dbConn     *sqlx.DB
//}

//func NewMatchmaker(minPlayers int, dbConn *sqlx.DB) *Matchmaker {
//	return &Matchmaker{
//		queue:      []*types.Player{},
//		minPlayers: minPlayers,
//		dbConn:     dbConn,
//	}
//}

// AddPlayer adds a player to the queue and creates a session if the minimum players threshold is met
//func (m *Matchmaker) QueuePlayer(player *types.Player) (*session.Session, error) {
//	m.mu.Lock()
//	defer m.mu.Unlock()
//
//	m.queue = append(m.queue, player)
//	fmt.Println(player)
//	// If enough players are in the queue, create a new session
//	if len(m.queue) >= m.minPlayers {
//		players := m.queue[:m.minPlayers]
//		m.queue = m.queue[m.minPlayers:] // Remove players from the queue
//
//		newSession := session.NewSession(players)
//
//		for i, p := range players {
//			newSession.Players[i] = p
//		}

// Persist the session to the database
//		err := db.CreateSession(m.dbConn, newSession)
//		if err != nil {
///			fmt.Println("error creating session`")
//			return nil, err
///		}
//
///		return newSession, nil
///	}
//	return nil, nil
//}
