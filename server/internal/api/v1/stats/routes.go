package stats

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func RegisterStatsRoutes(r *mux.Router, dbConn *sqlx.DB) {
	statsRouter := r.PathPrefix("/stats").Subrouter()
	statsRouter.HandleFunc("/leaderBoard", WinsLeaderboard(dbConn)).Methods(http.MethodGet)

}
