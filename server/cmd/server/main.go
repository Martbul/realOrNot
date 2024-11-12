package main

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/martbul/realOrNot/internal/api/v1/user"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/pkg/logger"
)

func main() {

	//Init logger
	logger.Init()
	log := logger.GetLogger()

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Error("Error loading .env file")
	}

	// Connect to the database
	dbConn, err := db.ConnectDB(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Error("Failed to connect to database", "error", err)
		return
	}
	defer dbConn.Close()

	//Settup routes
	r := mux.NewRouter()

	//Registering routes
	api := r.PathPrefix("").Subrouter()
	user.RegisterUserRoutes(api, dbConn)

	// Start the server
	log.Info("Starting server on 8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Error("Failed to start server", "error", err)
	}
}
