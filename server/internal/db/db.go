package db

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // Import the Postgres driver
)

// ConnectDB initializes and returns a database connection
func ConnectDB(connectionString string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", connectionString)
	if err != nil {
		log.Println("Failed to connect to the database:", err)
		return nil, err
	}
	log.Println("Database connection established")
	return db, nil
}
