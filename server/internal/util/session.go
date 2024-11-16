package util

import (
	"time"

	"github.com/google/uuid"
	"github.com/martbul/realOrNot/internal/types"
)

// CreateNewSession creates a new session with all required fields populated
func CreateNewSession(players []*types.Player) *types.Session {

	// Generate a new UUID for the session ID
	sessionID := uuid.New().String()

	// Create the session struct
	session := &types.Session{
		ID:        sessionID,                     // Set the generated session ID
		Players:   players,                       // List of player IDs
		Rounds:    []types.Round{},               // Initial rounds can be empty
		Status:    "waiting",                     // Session starts as "waiting"
		CreatedAt: time.Now(),                    // Set created timestamp
		ExpiresAt: time.Now().Add(1 * time.Hour), // Set expiration timestamp (1 hour TTL)
	}

	return session
}

