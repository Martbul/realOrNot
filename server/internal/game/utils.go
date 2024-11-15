package game

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateRounds() []Round {
	return []Round{
		{RealImageURL: "https://example.com/real1.jpg", FakeImageURL: "https://example.com/fake1.jpg", Correct: "real"},
		{RealImageURL: "https://example.com/real2.jpg", FakeImageURL: "https://example.com/fake2.jpg", Correct: "fake"},
		{RealImageURL: "https://example.com/real3.jpg", FakeImageURL: "https://example.com/fake3.jpg", Correct: "real"},
		{RealImageURL: "https://example.com/real4.jpg", FakeImageURL: "https://example.com/fake4.jpg", Correct: "fake"},
		{RealImageURL: "https://example.com/real5.jpg", FakeImageURL: "https://example.com/fake5.jpg", Correct: "real"},
	}
}

func GenerateSessionID() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("session-%d", rand.Int())
}
