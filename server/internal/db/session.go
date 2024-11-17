package db

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/game/session"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

func CreateSession(db *sqlx.DB, session *session.Session) error {

	log := logger.GetLogger()
	if db == nil {
		return fmt.Errorf("db is nil in CreateSession")
	}

	playersJSON, err := json.Marshal(session.Players)
	if err != nil {
		return fmt.Errorf("failed to serialize players: %w", err)
	}
	roundsJSON, err := json.Marshal(session.Rounds)
	if err != nil {
		return fmt.Errorf("failed to serialize rounds: %w", err)
	}

	query := `
		INSERT INTO sessions (session_id, users, rounds, status, created_at, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = db.Exec(query,
		session.ID,
		playersJSON,
		roundsJSON,
		session.Status,
		session.CreatedAt,
		session.ExpiresAt,
	)

	log.Info("New session created")
	return err
}

// GetSessionByID retrieves a session by its ID
func GetSessionByID(db *sqlx.DB, sessionID string) (*session.Session, error) {
	if db == nil {
		return nil, fmt.Errorf("db is nil in GetSessionByID")
	}

	var session session.Session
	var playersJSON, roundsJSON []byte

	query := `
		SELECT session_id, users, rounds, status, created_at, expires_at
		FROM sessions
		WHERE session_id = $1`
	err := db.QueryRow(query, sessionID).Scan(
		&session.ID,
		&playersJSON,
		&roundsJSON,
		&session.Status,
		&session.CreatedAt,
		&session.ExpiresAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No session found with that ID
		}
		return nil, err
	}

	// Deserialize JSON fields
	if err = json.Unmarshal(playersJSON, &session.Players); err != nil {
		return nil, fmt.Errorf("failed to deserialize players: %w", err)
	}
	if err = json.Unmarshal(roundsJSON, &session.Rounds); err != nil {
		return nil, fmt.Errorf("failed to deserialize rounds: %w", err)
	}

	return &session, nil
}

// UpdateSessionStatus updates the status of a session
func UpdateSessionStatus(db *sqlx.DB, sessionID, status string) error {
	if db == nil {
		return fmt.Errorf("db is nil in UpdateSessionStatus")
	}

	query := `
		UPDATE sessions
		SET status = $1
		WHERE session_id = $2`
	_, err := db.Exec(query, status, sessionID)
	return err
}

// DeleteSession removes a session from the database by ID
func DeleteSession(db *sqlx.DB, sessionID string) error {
	if db == nil {
		return fmt.Errorf("db is nil in DeleteSession")
	}

	query := `
		DELETE FROM sessions
		WHERE session_id = $1`
	_, err := db.Exec(query, sessionID)
	return err
}

// UpdateSessionPlayers updates the list of players in a session in the database.
func UpdateSessionPlayers(db *sqlx.DB, sessionID string, players []*types.Player) error {
	if db == nil {
		return fmt.Errorf("db is nil in UpdateSessionPlayers")
	}

	// Use a transaction to ensure consistency when updating players
	tx, err := db.Beginx()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback() // Rollback on failure to ensure no partial updates

	// Remove existing players from the session
	_, err = tx.Exec(`DELETE FROM session_players WHERE session_id = $1`, sessionID)
	if err != nil {
		return fmt.Errorf("failed to delete existing players from session: %v", err)
	}

	// Add new players to the session
	for _, player := range players {
		_, err = tx.Exec(`INSERT INTO session_players (session_id, user_id) VALUES ($1, $2)`, sessionID, player.ID)
		if err != nil {
			return fmt.Errorf("failed to insert user %s into session: %v", player.ID, err)
		}
	}

	// Commit the transaction to persist changes
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}
