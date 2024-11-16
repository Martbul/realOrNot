package game

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// JoinGame handler allows a player to join the matchmaking queue
func JoinGame(mm *matchmaker.Matchmaker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()

		// Decode player information from the request
		var playerData struct {
			PlayerID string `json:"player_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&playerData); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Create a player instance
		player := &types.Player{
			ID:   playerData.PlayerID,
			Conn: nil, // Will be set in WebSocket upgrade later
		}

		// Add player to the queue
		newSession, err := mm.AddPlayer(player)
		if err != nil {
			log.Error("Error while adding player to matchmaker:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if newSession != nil {
			log.Info("Game session created for player", player.ID)
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{
				"status":   "game_found",
				"session":  newSession.ID,
				"message":  "Game session started!",
				"playerId": player.ID,
			})
			return
		}

		log.Info("Player", player.ID, "added to the matchmaking queue")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "queued",
			"message": "You have been added to the queue. Waiting for more players...",
		})
	}
}

// GetGameStatus handler returns the current status of a game session by ID
func GetGameStatus(dbConn *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()

		// Retrieve session ID from the URL
		sessionID := mux.Vars(r)["id"]

		// Fetch session from the database
		session, err := db.GetSessionByID(dbConn, sessionID)
		if err != nil {
			log.Error("Error retrieving session from database:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		if session == nil {
			http.Error(w, "Session not found", http.StatusNotFound)
			return
		}

		// Return the session status
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"session_id": session.ID,
			"status":     session.Status,
			"players":    session.Players,
			"rounds":     session.Rounds,
		})
	}
}

// HandleWebSocketConnection upgrades the HTTP connection to a WebSocket for real-time communication
func HandleWebSocketConnection(dbConn *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()

		// Retrieve session ID from the URL
		sessionID := mux.Vars(r)["session_id"]

		// Fetch the session from the database
		session, err := db.GetSessionByID(dbConn, sessionID)
		if err != nil {
			log.Error("Error retrieving session from database:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		if session == nil {
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

		// Add the player to the session
		player := &types.Player{ID: "new-player-id", Conn: conn}
		session.Players = append(session.Players, player.ID)

		// Persist updated session players
		err = db.UpdateSessionPlayers(dbConn, session.ID, session.Players)
		if err != nil {
			log.Error("Failed to update session players:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Start listening to the WebSocket connection
		go listenToPlayer(player, session)
	}
}

func listenToPlayer(player *types.Player, session *types.Session) {
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
		// Replace with actual logic to handle gameplay
		log.Info("Player", player.ID, "guessed:", msg.Guess)
	}
}
