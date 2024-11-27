package stats

import (
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
)

type LeaderboardUserData struct {
	ID       int
	UserName string
	Wins     int
}

func WinsLeaderboard(dbConn *sqlx.DB) {
	leaderboardData := []LeaderboardUserData{}
	return db.getLeaderboard()
}
