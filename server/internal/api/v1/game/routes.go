package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/games/duelMatchmaker"
	"github.com/martbul/realOrNot/internal/games/streakGameMatchmaker"
)

func RegisterGameRoutes(r *mux.Router, duelMM *duelMatchmaker.Matchmaker, streakGameMM *streakGameMatchmaker.StreakGameMatchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()

	gameRouter.HandleFunc("/joinDuel", JoinDuel(duelMM, db)).Methods(http.MethodGet)

	gameRouter.HandleFunc("/playStreak", PlayStreak(streakGameMM, db)).Methods(http.MethodGet)

}
