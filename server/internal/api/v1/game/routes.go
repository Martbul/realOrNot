package game

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/games/duelMatchmaker"
	pinPointSPGameMatchmaker "github.com/martbul/realOrNot/internal/games/pinPointMatchmaker"
	"github.com/martbul/realOrNot/internal/games/streakGameMatchmaker"
)

func RegisterGameRoutes(r *mux.Router, duelMM *duelMatchmaker.Matchmaker, streakGameMM *streakGameMatchmaker.StreakGameMatchmaker, pinPointSPMM *pinPointSPGameMatchmaker.PinPointSPGameMatchmaker, db *sqlx.DB) {
	gameRouter := r.PathPrefix("/game").Subrouter()

	//DUEL MP
	gameRouter.HandleFunc("/joinDuel", JoinDuel(duelMM, db)).Methods(http.MethodGet)

	//STREAK SP
	gameRouter.HandleFunc("/playStreak", PlayStreak(streakGameMM, db)).Methods(http.MethodGet)

	//PINPOINT SP
	gameRouter.HandleFunc("/getPinPointRoundData", PlayPinPointSP(pinPointSPMM, db)).Methods(http.MethodGet)
	gameRouter.HandleFunc("/pinPointSPResults", EvaluatePinPointSPResult(pinPointSPMM, db)).Methods(http.MethodPost)

}
