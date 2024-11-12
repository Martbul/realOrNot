package types

// User represents a user entity
type User struct {
	Id             string `db:"id" json:"id"`
	UserName       string `db:"username" json:"username"`
	Email          string `db:"email" json:"email"`
	HashedPassword string `db:"password_hash" json:"hashedPassword"`
}
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
