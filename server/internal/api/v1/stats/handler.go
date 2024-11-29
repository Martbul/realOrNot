package stats

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
)

type LeaderboardUserData struct {
	ID       int
	UserName string
	Wins     int
}

func WinsLeaderboard(dbConn *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		//TODO: Improve error handling
		lbPlayerStats, _ := db.GetWinsLeaderboard(dbConn)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(lbPlayerStats)

	}
}
