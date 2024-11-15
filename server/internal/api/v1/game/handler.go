package game

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
	"github.com/martbul/realOrNot/internal/game/session"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// JoinGame handler allows a player to join the matchmaking queue
func JoinGame(mm *matchmaker.Matchmaker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Decode player information from the request
		var playerData struct {
			PlayerID string `json:"player_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&playerData); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		// Simulate WebSocket connection (replace with real WebSocket later)
		player := &game.Player{
			ID:   playerData.PlayerID,
			Conn: nil, // Will be set in WebSocket upgrade later
		}

		// Add player to the queue
		session := mm.AddPlayer(player)
		if session != nil {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{
				"status":   "game_found",
				"session":  session.ID,
				"message":  "Game session started!",
				"playerId": player.ID,
			})
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "queued",
			"message": "You have been added to the queue. Waiting for more players...",
		})
	}
}

// GetGameStatus handler returns the current status of a game session by ID
func GetGameStatus(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Retrieve session ID from the URL
		sessionID := mux.Vars(r)["id"]

		// Placeholder: Add logic to fetch session info from a database or in-memory storage
		sessionInfo := map[string]string{
			"session_id": sessionID,
			"status":     "ongoing", // Replace with actual session status
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(sessionInfo)
	}
}

// HandleWebSocketConnection upgrades the HTTP connection to a WebSocket for real-time communication
func HandleWebSocketConnection(mm *matchmaker.Matchmaker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Retrieve session ID from the URL
		sessionID := mux.Vars(r)["session_id"]

		// Get the session based on sessionID
		sess := session.GetSessionByID(sessionID) // Assume you have a function to retrieve sessions
		if sess == nil {
			http.Error(w, "Session not found", http.StatusNotFound)
			return
		}

		// Upgrade the connection to WebSocket
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
			return
		}

		// Add the player to the session and start listening
		player := &game.Player{ID: "new-player-id", Conn: conn}
		sess.AddPlayer(player) // Assume your session has an AddPlayer method
		go listenToPlayer(player, sess)
	}
}

func listenToPlayer(player *game.Player, sess *session.Session) {
	// Example listener for player inputs
	for {
		var msg struct {
			Guess string `json:"guess"`
		}
		if err := player.Conn.ReadJSON(&msg); err != nil {
			// Handle disconnection or errors
			break
		}

		// Process the player's guess
		sess.ProcessGuess(player, msg.Guess) // Assume a method to handle guesses
	}
}
