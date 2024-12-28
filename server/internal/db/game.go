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
    LIMIT 5;
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

func AddPlayerDuelWin(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	query := `UPDATE users SET duelwins = duelwins + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func AddPlayerDuelGamesPlayed(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	query := `UPDATE users SET duelgamesplayed = duelgamesplayed + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func AddPlayerAllGamesPlayed(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	query := `UPDATE users SET allgamesplayed = allgamesplayed + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func AddPlayerGamesWin(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	query := `UPDATE users SET allwins = allwins + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func AddPlayerPinPointSPGamesPlayed(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	query := `UPDATE users SET pinpointspgamesplayed = pinpointspgamesplayed + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func AddPlayerPinPointSPWin(dbConn *sqlx.DB, userID string) error {
	if dbConn == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := dbConn.Beginx()
	if err != nil {
		fmt.Printf("[ERROR] Failed to begin transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	query := `UPDATE users SET pinpointspwins = pinpointspwins + 1 WHERE id = $1`
	_, execErr := tx.Exec(query, userID)
	if execErr != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			fmt.Printf("[ERROR] Failed to rollback transaction for userID: %s, rollback error: %v\n", userID, rbErr)
			return fmt.Errorf("failed to execute query and rollback failed: %w; rollback error: %v", execErr, rbErr)
		}
		return fmt.Errorf("failed to execute query: %w", execErr)
	}

	if err := tx.Commit(); err != nil {
		fmt.Printf("[ERROR] Failed to commit transaction for userID: %s, error: %v\n", userID, err)
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}
