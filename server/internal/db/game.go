package db

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

func GetRound(db *sqlx.DB) (types.Round, error) {
	log := logger.GetLogger()
	if db == nil {
		return types.Round{}, fmt.Errorf("DB is nil in GetRound")
	}

	var round types.Round

	query := `
    SELECT img_1_url, img_2_url, correct
    FROM rounds
    ORDER BY RANDOM()
    LIMIT 1;
`

	err := db.Get(&round, query) // Use db.Get for a single row
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Warn("No rounds found in the database")
			return types.Round{}, nil // Return nil for empty result
		}
		log.Error("Failed to fetch random round: ", err)
		return types.Round{}, err
	}

	log.Info("Random round fetched successfully")
	return round, nil
}

func GetRandomRounds(db *sqlx.DB) ([]types.Round, error) {
	log := logger.GetLogger()
	if db == nil {
		return nil, fmt.Errorf("db is nil in GetRandomRounds")
	}

	var rounds []types.Round

	query := `
    SELECT img_1_url, img_2_url, correct
    FROM (
        SELECT DISTINCT img_1_url, img_2_url, correct
        FROM rounds
    ) subquery
    ORDER BY RANDOM()
    LIMIT 5;
`

	err := db.Select(&rounds, query)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Warn("No rounds found in the database")
			return nil, nil
		}
		log.Error("Failed to fetch random rounds: ", err)
		return nil, err
	}

	log.Info("Random rounds fetched successfully")

	return rounds, nil
}

func GetPinPointSPRoundData(db *sqlx.DB) ([]types.PinPointRoundData, error) {

	log := logger.GetLogger()

	if db == nil {
		return nil, fmt.Errorf("db is nill in pinPointsSP")
	}

	var gameRoundsData []types.PinPointRoundData

	query := `
    SELECT image_url, x, y, width, height
    FROM (
        SELECT DISTINCT image_url, x, y, width, height
        FROM pinpointimages
    ) subquery
    ORDER BY RANDOM()
    LIMIT 10;
`

	err := db.Select(&gameRoundsData, query)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Warn("No rounds found in the database")
			return nil, nil
		}
		log.Error("Failed to fetch game rounds data: ", err)
		return nil, err
	}

	log.Info("Random rounds fetched successfully")

	return gameRoundsData, nil

}

func AddPlayerWin(db *sqlx.DB, userID string) error {
	if db == nil {
		return fmt.Errorf("db is nil in AddWin")
	}
	fmt.Println("starting to add win to player:", userID)

	tx, err := db.Beginx()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}

	// Update winsLeaderboard table
	queryLeaderboard := `
		INSERT INTO winsLeaderboard (user_id, total_wins) 
		VALUES ($1, 1)
		ON CONFLICT (user_id) 
		DO UPDATE SET total_wins = winsLeaderboard.total_wins + 1, last_updated = CURRENT_TIMESTAMP`
	if _, err := tx.Exec(queryLeaderboard, userID); err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to update winsLeaderboard for userID %s: %w", userID, err)
	}

	// Synchronize users table
	queryUsers := `
		UPDATE users 
		SET wins = (SELECT total_wins FROM winsLeaderboard WHERE user_id = $1) 
		WHERE id = $1`
	if _, err := tx.Exec(queryUsers, userID); err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to update users table for userID %s: %w", userID, err)
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
