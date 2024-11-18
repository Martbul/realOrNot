package game

import (
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
	"github.com/martbul/realOrNot/internal/game/session"
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

		// Channel to signal goroutine exit
		done := make(chan struct{})

		// Set WebSocket read deadlines and pong handler
		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		// Goroutine for reading messages (keeps connection alive)
		go func() {
			defer close(done) // Signal exit when goroutine finishes
			for {
				_, _, err := conn.ReadMessage()
				if err != nil {
					log.Error("WebSocket read error, closing connection:", err)
					return
				}
			}
		}()

		// Goroutine for sending periodic "still waiting" messages
		go func() {
			for {
				select {
				case <-time.After(10 * time.Second):
					if err := conn.WriteJSON(map[string]string{
						"status":  "waiting",
						"message": "Still waiting for more players to join...",
					}); err != nil {
						log.Error("Waiting message failed, closing connection:", err)
						return
					}
				case <-done: // Exit loop if read goroutine finishes
					return
				}
			}
		}()

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

		// Add player to matchmaking queue
		newSession, err := mm.QueuePlayer(player)
		if err != nil {
			log.Error("Error adding player to queue:", err)
			conn.WriteJSON(map[string]string{"error": "Internal server error"})
			return
		}

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

// Handler for players interacting with an existing session
func HandleWebSocketConnection(mm *matchmaker.Matchmaker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()
		sessionID := mux.Vars(r)["session_id"]

		mm.Mu.Lock()
		sess, exists := mm.Sessions[sessionID]
		mm.Mu.Unlock()

		if !exists {
			http.Error(w, "Session not found", http.StatusNotFound)
			return
		}

		// Upgrade the connection to WebSocket
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error("Error upgrading connection to WebSocket:", err)
			http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
			return
		}
		defer conn.Close()

		player := &types.Player{
			ID:   "new-player-id", // Ideally, you'd retrieve or assign a proper ID
			Conn: conn,
		}

		// Add the player to the session
		mm.Mu.Lock()
		sess.Players = append(sess.Players, player)
		mm.Mu.Unlock()

		go listenToPlayer(player, sess)
	}
}

// Listen to messages from a player
func listenToPlayer(player *types.Player, sess *session.Session) {
	log := logger.GetLogger()

	for {
		var msg struct {
			Guess string `json:"guess"`
		}
		if err := player.Conn.ReadJSON(&msg); err != nil {
			log.Error("Error reading message from player:", err)
			break
		}

		// Process the player's guess (placeholder logic)
		log.Info("Player", player.ID, "guessed:", msg.Guess)
	}
}

// Game session handler that triggers the game lifecycle
func handleMatchmaking(mm *matchmaker.Matchmaker, player *types.Player, conn *websocket.Conn) {
	log := logger.GetLogger()

	if err := conn.WriteJSON(map[string]string{
		"status":  "queued",
		"message": "You have been added to the queue. Waiting for more players...",
	}); err != nil {
		log.Error("Error sending queue status to player:", err)
		return
	}

	// Attempt to create a session
	newSession, err := mm.QueuePlayer(player)
	if err != nil {
		log.Error("Error while adding player to matchmaker:", err)
		conn.WriteJSON(map[string]string{"error": "Internal server error"})
		return
	}

	if newSession != nil {
		log.Info("Game session created for player", player.ID)
		if err := conn.WriteJSON(map[string]string{
			"status":  "game_found",
			"session": newSession.ID,
			"message": "Game session will start soon!",
		}); err != nil {
			log.Error("Error notifying player about game session:", err)
		}

		// Start the session after 5 seconds
		time.Sleep(5 * time.Second)
		mm.StartSession(newSession)
	}
}

//var upgrader = websocket.Upgrader{
//	CheckOrigin: func(r *http.Request) bool { return true },
//}

//func JoinGame(mm *matchmaker.Matchmaker) http.HandlerFunc {
//	return func(w http.ResponseWriter, r *http.Request) {
//		log := logger.GetLogger()
//
//		var playerData struct {
//			PlayerID string `json:"player_id"`
//		}
//		if err := json.NewDecoder(r.Body).Decode(&playerData); err != nil {
//			http.Error(w, "Invalid request payload", http.StatusBadRequest)
//			return
//		}
//
//		player := &types.Player{
//			ID:   playerData.PlayerID,
//			Conn: nil, // Will be set in WebSocket upgrade later
//		}

// Add player to the queue
//		newSession, err := mm.QueuePlayer(player)
//		if err != nil {
//			log.Error("Error while adding player to matchmaker:", err)
//			http.Error(w, "Internal server error", http.StatusInternalServerError)
//			return
//		}

//		if newSession != nil {
//			log.Info("Game session created for player", player.ID)
///			w.WriteHeader(http.StatusOK)
//			json.NewEncoder(w).Encode(map[string]string{
//				"status":   "game_found",
//				"session":  newSession.ID,
//				"message":  "Game session started!",
//				"playerId": player.ID,
///			})
//			return
//		}
//
//		log.Info("Player", player.ID, "added to the matchmaking queue")
//		w.WriteHeader(http.StatusOK)
//		json.NewEncoder(w).Encode(map[string]string{
//			"status":  "queued",
//			"message": "You have been added to the queue. Waiting for more players...",
//		})
//	}
//}/

//func GetGameStatus(dbConn *sqlx.DB) http.HandlerFunc {
//	return func(w http.ResponseWriter, r *http.Request) {
//		log := logger.GetLogger()
//
//		sessionID := mux.Vars(r)["id"]
//
//		// Fetch session from the database
//		session, err := db.GetSessionByID(dbConn, sessionID)
//		if err != nil {
//			log.Error("Error retrieving session from database:", err)
//			http.Error(w, "Internal server error", http.StatusInternalServerError)
//			return
//		}
//		if session == nil {
//			http.Error(w, "Session not found", http.StatusNotFound)
//			return
//		}
//
//		w.WriteHeader(http.StatusOK)
//		json.NewEncoder(w).Encode(map[string]interface{}{
//			"session_id": session.ID,
//			"status":     session.Status,
//			"players":    session.Players,
//			"rounds":     session.Rounds,
//		})
//	}
//}

//func HandleWebSocketConnection(dbConn *sqlx.DB) http.HandlerFunc {
//	return func(w http.ResponseWriter, r *http.Request) {
//		log := logger.GetLogger()
//
//		sessionID := mux.Vars(r)["session_id"]
//
//		// Fetch the session from the database
//		session, err := db.GetSessionByID(dbConn, sessionID)
//		if err != nil {
//			log.Error("Error retrieving session from database:", err)
//			http.Error(w, "Internal server error", http.StatusInternalServerError)
//			return
//		}
//		if session == nil {
//			http.Error(w, "Session not found", http.StatusNotFound)
//			return
//		}
//
// Upgrade the connection to WebSocket
//		conn, err := upgrader.Upgrade(w, r, nil)
//		if err != nil {
//			log.Error("Error upgrading connection to WebSocket:", err)
//			http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
//			return
//		}

// Add the player to the session
//		player := &types.Player{ID: "new-player-id", Conn: conn}
//		session.Players = append(session.Players, player)
//
// Persist updated session players
//		err = db.UpdateSessionPlayers(dbConn, session.ID, session.Players)
//		if err != nil {
//			log.Error("Failed to update session players:", err)
//			http.Error(w, "Internal server error", http.StatusInternalServerError)
//			return
//		}
//
//		go listenToPlayer(player, session)
//	}
//}

//func listenToPlayer(player *types.Player, session *session.Session) {
//	log := logger.GetLogger()
//
//	for {
//		var msg struct {
//			Guess string `json:"guess"`
//		}
//		if err := player.Conn.ReadJSON(&msg); err != nil {
//			log.Error("Error reading message from player:", err)
//			break
//		}
//
// Process the player's guess (placeholder logic)
// Replace with actual logic to handle gameplay
//		log.Info("Player", player.ID, "guessed:", msg.Guess)
//	}
//:W
