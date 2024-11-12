package util

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Secret key for JWT signing, loaded from .env
var jwtSecret = os.Getenv("JWT_SECRET")

// GenerateJWT creates a signed JWT with a username claim.
func GenerateJWT(username string, email string) (string, error) {
	// Create the JWT claims, including the username and expiry time
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["username"] = username
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix() // 24-hour expiry

	// Create and sign the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}
