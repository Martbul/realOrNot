package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	gohandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/martbul/realOrNot/internal/api/v1/game"
	"github.com/martbul/realOrNot/internal/api/v1/user"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/game/matchmaker"
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
	surveMux := mux.NewRouter()

	surveMux.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	mm := matchmaker.NewMatchmaker(2, dbConn)
	//Registering routes
	api := surveMux.PathPrefix("").Subrouter()
	user.RegisterUserRoutes(api, dbConn)
	game.RegisterGameRoutes(api, mm, dbConn)

	//CORS
	cors := gohandlers.CORS(
		gohandlers.AllowedOrigins([]string{"*"}),                                       // allow the specific origin
		gohandlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), // allow methods
		gohandlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),           // allow necessary headers
		gohandlers.AllowCredentials(),                                                  // Allow cookies (if you're using them)
	)

	// CORS
	//	cors := gohandlers.CORS(gohandlers.AllowedOrigins([]string{"http://localhost:3000"}))
	// Configure the server
	server := &http.Server{
		Addr:         ":8080",
		Handler:      cors(surveMux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Run the server in a separate goroutine
	go func() {
		log.Info("Starting server on port 8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error("Error starting server", "error", err)
			os.Exit(1)
		}
	}()

	// Set up signal channel for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, os.Kill)

	// Block until a signal is received
	sig := <-sigChan
	log.Info("Received shutdown signal:", sig)

	// Create a context with timeout for graceful shutdown
	timeoutContext, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(timeoutContext); err != nil {
		log.Error("Server shutdown failed", "error", err)
	} else {
		log.Info("Server shut down gracefully")
	}
}
