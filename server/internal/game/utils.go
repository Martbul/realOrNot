package game

import (
	"math/rand/v2"

	"github.com/google/uuid"
)

func randRange(min, max int) int {
	return rand.IntN(max-min) + min
}

func GenerateSessionID() string {
	return uuid.NewString()

}
