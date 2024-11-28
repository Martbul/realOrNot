package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func GetWinsLeaderboard(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get winsLeaderboard: db is nil")
	}

	// Array to store the top 20 players
	var leaderboard []struct {
		UserID    int `db:"user_id"`
		TotalWins int `db:"total_wins"`
	}

	// Query to get the 20 players with the most wins
	query := `
		SELECT user_id, total_wins 
		FROM winsleaderboard 
		ORDER BY total_wins DESC 
		LIMIT 20
	`
	// Execute the query to get the leaderboard data
	err := db.Select(&leaderboard, query)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve leaderboard: %v", err)
	}

	// Array to store the user data in map format
	var results []map[string]interface{}

	// Loop over the leaderboard data and get each user's details
	for _, entry := range leaderboard {
		var user struct {
			ID       int    `db:"id"`
			Username string `db:"username"`
		}

		// Query to get user details by user_id
		userQuery := `SELECT id, username FROM users WHERE id = $1`
		err := db.Get(&user, userQuery, entry.UserID)
		if err != nil {
			// If user not found or error occurs, we skip to the next one
			continue
		}

		// Create a map for this user with id, username, and wins
		userMap := map[string]interface{}{
			"id":       user.ID,
			"username": user.Username,
			"wins":     entry.TotalWins,
		}

		// Add the map to the results array
		results = append(results, userMap)
	}

	// Return the list of maps
	return results, nil
}
