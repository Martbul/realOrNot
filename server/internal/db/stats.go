package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func GetPinPointSPTopPlayers(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get pinPointSP top players: db is nil")
	}

	var pinPointSPLeaderboard []struct {
		ID             string `db:"id"`
		Username       string `db:"username"`
		PinPointSPWins int    `db:"pinpointspwins"`
	}

	query := `
		SELECT id, username, pinpointspwins 
		FROM users 
		ORDER BY pinpointspwins DESC 
		LIMIT 3
	`

	err := db.Select(&pinPointSPLeaderboard, query)
	if err != nil {
		fmt.Printf("Query execution failed: %v\n", err)
		return nil, fmt.Errorf("Failed to retrieve pinPointSP leaderboard: %w", err)
	}

	var results []map[string]interface{}
	for _, entry := range pinPointSPLeaderboard {
		userMap := map[string]interface{}{
			"id":         entry.ID,
			"username":   entry.Username,
			"streakwins": entry.PinPointSPWins,
		}
		results = append(results, userMap)
	}

	return results, nil
}

func GetStreakTopPlayers(db *sqlx.DB) ([]map[string]interface{}, error) {
	if db == nil {
		return nil, fmt.Errorf("Unable to get streak top players: db is nil")
	}

	var streakLeaderboard []struct {
		ID                 string `db:"id"`
		Username           string `db:"username"`
		StreakHighestScore int    `db:"streakgamehighestscore"`
	}

	query := `
		SELECT id, username, streakgamehighestscore 
		FROM users 
		ORDER BY streakgamehighestscore DESC 
		LIMIT 3
	`

	err := db.Select(&streakLeaderboard, query)
	if err != nil {
		fmt.Printf("Query execution failed: %v\n", err)
		return nil, fmt.Errorf("Failed to retrieve streak leaderboard: %w", err)
	}

	var results []map[string]interface{}
	for _, entry := range streakLeaderboard {
		userMap := map[string]interface{}{
			"id":                 entry.ID,
			"username":           entry.Username,
			"streakhighestscore": entry.StreakHighestScore,
		}
		results = append(results, userMap)
	}

	return results, nil
}

func GetDuelTopPlayers(db *sqlx.DB) ([]map[string]interface{}, error) {
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
		LIMIT 3
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
