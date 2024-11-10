package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/martbul/realOrNot/internal/api/v1/user"
	"github.com/martbul/realOrNot/pkg/logger"
)

func main() {
	logger.Init()

	log := logger.GetLogger()

	r := mux.NewRouter()

	//Registering routes
	api := r.PathPrefix("").Subrouter()
	user.RegisterUserRoutes(api)

	// Start the server
	log.Info("Starting server on 8080")
	// log.Fatal(http.ListenAndServe(":8080", r))
	// Start the server and handle any error during startup
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Error("Failed to start server", "error", err)
	}
}
