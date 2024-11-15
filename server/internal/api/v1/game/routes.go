package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
)

func RegisterGameRoutes(r *mux.Router, matchmaker *matchmaker.Matchmaker, db *sqlx.DB) {

	gameRouter := r.PathPrefix("/game").Subrouter()

	// Register the join game route
	gameRouter.HandleFunc("/join", JoinGame(matchmaker)).Methods(http.MethodPost)

	// Register the WebSocket route for game sessions
	gameRouter.HandleFunc("/session/{session_id}", HandleWebSocketConnection(matchmaker)).Methods(http.MethodGet)

	// Optionally register a route to check game status
	gameRouter.HandleFunc("/{id}", GetGameStatus(db)).Methods(http.MethodGet)
}
