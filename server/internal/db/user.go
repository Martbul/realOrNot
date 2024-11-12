package db

import (
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/types"
)

// CreateUser saves a new user in the database
func CreateUser(db *sqlx.DB, user *types.User) error {
	query := `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`
	return db.QueryRowx(query, user.UserName, user.HashedPassword).Scan(&user.Id)
}

// GetUserByUsername retrieves a user by their username
func GetUserByUsername(db *sqlx.DB, username string) (*types.User, error) {
	var user types.User
	query := `SELECT id, username, password FROM users WHERE username = $1`
	err := db.Get(&user, query, username)
	return &user, err
}
