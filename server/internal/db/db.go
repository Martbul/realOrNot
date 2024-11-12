package db

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // Import the Postgres driver
	"github.com/martbul/realOrNot/pkg/logger"
)

// ConnectDB initializes and returns a database connection
func ConnectDB(connectionString string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", connectionString)

	log := logger.GetLogger()
	if err != nil {
		return nil, err
	}
	log.Info("Connected to DB")
	return db, nil
}
