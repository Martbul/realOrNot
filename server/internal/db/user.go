package db

import (
	"errors"

	"github.com/martbul/realOrNot/internal/types"
)

// Simulating a simple in-memory store
var users = make(map[string]types.User)

// CreateUser inserts a new user into the database
func CreateUser(user types.User) (types.User, error) {
	if _, exists := users[user.ID]; exists {
		return types.User{}, errors.New("user already exists")
	}

	users[user.ID] = user
	return user, nil
}

// GetUserByID retrieves a user by their ID from the database
func GetUserByID(id string) (types.User, error) {
	user, exists := users[id]
	if !exists {
		return types.User{}, errors.New("user not found")
	}
	return user, nil
}
