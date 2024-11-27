package db

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/types"
)

// CreateUser saves a new user in the database
func CreateUser(db *sqlx.DB, user *types.User) error {
	if db == nil {
		return fmt.Errorf("db is nil in CreateUser")
	}
	query := `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id`
	return db.QueryRowx(query, user.UserName, user.Email, user.HashedPassword).Scan(&user.Id)
}

// GetUserByEmail retrieves a user by their email
func GetUserByEmail(db *sqlx.DB, email string) (*types.User, error) {
	if db == nil {
		return nil, fmt.Errorf("db is nil in CreateUser")
	}
	var user types.User
	query := `SELECT id, username, email, password_hash FROM users WHERE email = $1`
	err := db.Get(&user, query, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No user found with that email
		}
		return nil, err // Other database error
	}
	return &user, nil
}

func GetUserById(db *sqlx.DB, id string) (*types.User, error) {
	if db == nil {
		return nil, fmt.Errorf("db is nil in GetUserById")
	}
	var user types.User
	query := `SELECT id, username, email, password_hash FROM users WHERE id = $1`
	err := db.Get(&user, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No user found with the given id
		}
		return nil, fmt.Errorf("failed to get user by id: %v", err) // Other database error
	}
	return &user, nil
}
