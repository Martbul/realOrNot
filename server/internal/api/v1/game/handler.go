package game

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins
	},
}

func JoinGameViaWebSocket(mm *matchmaker.Matchmaker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()

		// Upgrade the connection to WebSocket
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error("WebSocket upgrade failed:", err)
			http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
			return
		}

		// Channels to signal goroutine exit
		done := make(chan struct{})

		// Set WebSocket read deadlines and pong handler
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		// Handle player joining
		var playerData struct {
			PlayerID string `json:"player_id"`
		}
		if err := conn.ReadJSON(&playerData); err != nil {
			log.Error("Error reading player data:", err)
			conn.WriteJSON(map[string]string{"error": "Invalid request payload"})
			return
		}

		player := &types.Player{
			ID:   playerData.PlayerID,
			Conn: conn,
		}

		// Goroutine for sending periodic "still waiting" messages
		go func() {
			for {
				select {
				case <-time.After(10 * time.Second):
					// Check if the player is in a game
					if inGame, ok := mm.PlayerStates.Load(player.ID); ok && inGame.(bool) {
						return // Exit loop if player is in a game
					}

					if err := conn.WriteJSON(map[string]string{
						"status":  "waiting",
						"message": "Still waiting for more players to join...",
					}); err != nil {
						log.Error("Waiting message failed, closing connection:", err)
						return
					}
				case <-done: // Exit loop if connection is closed
					return
				}
			}
		}()

		// Add player to matchmaking queue
		newSession, err := mm.QueuePlayer(player)
		if err != nil {
			log.Error("Error adding player to queue:", err)
			conn.WriteJSON(map[string]string{"error": "Internal server error"})
			return
		}

		// Notify player if they joined a session
		if newSession != nil {
			if err := conn.WriteJSON(map[string]string{
				"status":   "game_found",
				"session":  newSession.ID,
				"message":  "Game session started!",
				"playerId": player.ID,
			}); err != nil {
				log.Error("Error notifying player about game session:", err)
			}
		}

		// Block until the `done` channel is closed
		<-done

		// Close the WebSocket connection when done
		log.Info("Closing WebSocket connection for player:", player.ID)
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		conn.Close()
	}
}
