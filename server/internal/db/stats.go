package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func GetDuelWinsLeaderboard(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get wins leaderboard: db is nil")
	}

	var leaderboard []struct {
		ID       string `db:"id"`
		Username string `db:"username"`
		DuelWins int    `db:"duelwins"`
	}

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

func GetProfileStats(db *sqlx.DB, userId string) (map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get wins leaderboard: db is nil")
	}

	var userProfileStats struct {
		AllGamesPlayed         int `db:"allgamesplayed"`
		AllWins                int `db:"allwins"`
		DuelGamesPlayed        int `db:"duelgamesplayed"`
		DuelWins               int `db:"duelwins"`
		PinPointSPGamesPlayed  int `db:"pinpointspgamesplayed"`
		PinPointSPWins         int `db:"pinpointspwins"`
		StreakGameHighestScore int `db:"streakgamehighestscore"`
		StreakGamesPlayed      int `db:"streakgamesplayed"`
	}

	query := `SELECT allgamesplayed, allwins, duelgamesplayed, duelwins, pinpointspgamesplayed, pinpointspwins, streakgamehighestscore, streakgamesplayed
    FROM users WHERE id = $1`

	err := db.Get(&userProfileStats, query, userId)
	if err != nil {
		fmt.Printf("Query execution failed: %v\n", err)
		return nil, fmt.Errorf("Failed to retrieve leaderboard: %w", err)
	}

	result := map[string]interface{}{
		"AllGamesPlayed":         userProfileStats.AllGamesPlayed,
		"AllWins":                userProfileStats.AllWins,
		"DuelGamesPlayed":        userProfileStats.DuelGamesPlayed,
		"DuelWins":               userProfileStats.DuelWins,
		"PinPointSPGamesPlayed":  userProfileStats.PinPointSPGamesPlayed,
		"PinPointSPWins":         userProfileStats.PinPointSPWins,
		"StreakGameHighestScore": userProfileStats.StreakGameHighestScore,
		"StreakGamesPlayed":      userProfileStats.StreakGamesPlayed,
	}

	return result, nil
}
