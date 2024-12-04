package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	duelMatchmaker "github.com/martbul/realOrNot/internal/games/duelMatchmaker"
)

func RegisterGameRoutes(r *mux.Router, duelMM *duelMatchmaker.Matchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()

	gameRouter.HandleFunc("/joinDuel", JoinDuel(duelMM, db)).Methods(http.MethodGet)

	//WARN: Websocket is the best option cause it needs immediate check if tha answer is right
	gameRouter.HandleFunc("/playStreak", PlayStreak(db)).Methods(http.MethodGet)

}
