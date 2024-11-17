package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
)

// RegisterGameRoutes sets up the routes for game-related operations.
func RegisterGameRoutes(r *mux.Router, matchmaker *matchmaker.Matchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()

	// WebSocket-based game join route
	gameRouter.HandleFunc("/join", JoinGameViaWebSocket(matchmaker)).Methods(http.MethodGet)

	// WebSocket connection for a specific game session
	gameRouter.HandleFunc("/session/{session_id}", HandleWebSocketConnection(matchmaker)).Methods(http.MethodGet)

	// Fetch game session status
	//	gameRouter.HandleFunc("/{id}", GetGameStatus(db)).Methods(http.MethodGet)
}
