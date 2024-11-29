package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func GetWinsLeaderboard(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get winsLeaderboard: db is nil")
	}

	var leaderboard []struct {
		UserID    string `db:"user_id"`
		TotalWins int    `db:"total_wins"`
	}

	query := `
		SELECT user_id, total_wins 
		FROM winsleaderboard 
		ORDER BY total_wins DESC 
		LIMIT 20
	`
	err := db.Select(&leaderboard, query)
	if err != nil {
		fmt.Printf("Query execution failed: %v\n", err)
		return nil, fmt.Errorf("Failed to retrieve leaderboard: %w", err)
	}

	var results []map[string]interface{}
	fmt.Println(leaderboard)
	for _, entry := range leaderboard {
		var user struct {
			ID       string `db:"id"`
			Username string `db:"username"`
		}

		userQuery := `SELECT id, username FROM users WHERE id = $1`
		err := db.Get(&user, userQuery, entry.UserID)
		if err != nil {
			continue
		}

		userMap := map[string]interface{}{
			"id":       user.ID,
			"username": user.Username,
			"wins":     entry.TotalWins,
		}

		results = append(results, userMap)
	}
	return results, nil
}
