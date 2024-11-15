package game

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
)

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
