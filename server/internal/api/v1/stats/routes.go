package stats

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func RegisterStatsRoutes(r *mux.Router, dbConn *sqlx.DB) {
	statsRouter := r.PathPrefix("/stats").Subrouter()
	statsRouter.HandleFunc("/leaderboard", DuelWinsLeaderboard(dbConn)).Methods(http.MethodGet)
	statsRouter.HandleFunc("/profile", ProfileStats(dbConn)).Methods(http.MethodPost)

}
