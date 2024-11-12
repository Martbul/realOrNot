package types

// User represents a user entity
type User struct {
	Id             string `json:"id"`
	UserName       string `json:"name"`
	Email          string `json:"email"`
	HashedPassword string `json:"hashedPassword"`
}

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
