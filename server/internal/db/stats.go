package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func GetWinsLeaderboard(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get wins leaderboard: db is nil")
	}

	// Structure to hold the leaderboard data
	var leaderboard []struct {
		ID       string `db:"id"`
		Username string `db:"username"`
		DuelWins int    `db:"duelwins"`
	}

	// Query to get the top 20 users by duel wins from the users table
	query := `
		SELECT id, username, duelwins 
		FROM users 
		ORDER BY duelwins DESC 
		LIMIT 20
	`

	err := db.Select(&leaderboard, query)
	if err != nil {
		fmt.Printf("Query execution failed: %v\n", err)
		return nil, fmt.Errorf("Failed to retrieve leaderboard: %w", err)
	}

	// Convert leaderboard data into a slice of maps
	var results []map[string]interface{}
	for _, entry := range leaderboard {
		userMap := map[string]interface{}{
			"id":       entry.ID,
			"username": entry.Username,
			"duelwins": entry.DuelWins,
		}
		results = append(results, userMap)
	}

	return results, nil
}
