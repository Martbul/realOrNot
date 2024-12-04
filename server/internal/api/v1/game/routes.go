package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	duelMatchmaker "github.com/martbul/realOrNot/internal/games/duelMatchmaker"
)

// RegisterGameRoutes sets up the routes for game-related operations.
func RegisterGameRoutes(r *mux.Router, duelMM *duelMatchmaker.Matchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()

	// WebSocket-based game join route
	gameRouter.HandleFunc("/joinDuel", JoinDuelViaWebSocket(duelMM, db)).Methods(http.MethodGet)

	// WebSocket connection for a specific game session
	//	gameRouter.HandleFunc("/session/{session_id}", HandleWebSocketConnection(matchmaker)).Methods(http.MethodGet)

	// Fetch game session status
	//	gameRouter.HandleFunc("/{id}", GetGameStatus(db)).Methods(http.MethodGet)
}
