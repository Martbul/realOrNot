package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
)

func RegisterGameRoutes(r *mux.Router, matchmaker *matchmaker.Matchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()
	gameRouter.HandleFunc("/join", JoinGame(matchmaker)).Methods(http.MethodPost)
	gameRouter.HandleFunc("/status/{id}", GetGameStatus(db)).Methods(http.MethodGet)
}
