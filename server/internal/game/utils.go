// internal/game/utils.go
package game

import (
	"fmt"
	"math/rand"
)

//here the func in private
//func generateSessionID() string {
//	return "session-" + fmt.Sprint(rand.Intn(100000))
//}

func GenerateSessionID() string {
	return "session-" + fmt.Sprint(rand.Intn(100000))
}

func GenerateRounds() []Round {
	// Generate some example rounds (in real app, pull from a DB or service)
	return []Round{
		{ImageURL: "https://example.com/real1.jpg", Answer: true},
		{ImageURL: "https://example.com/fake1.jpg", Answer: false},
		// Additional rounds can be added or retrieved dynamically
	}
}
