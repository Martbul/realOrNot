package main

import (
	"github.com/gorilla/mux"
	"github.com/martbul/realOrNot/pkg/logger"
)

func main() {
	logger.Init()

	log := logger.GetLogger()

	log.Info("Starting server...")

	r := mux.NewRouter()

	//Registering routes
	api := r.PathPrefix("/api/v1").Subrouter()
	user.RegisterUserRoutes(api)

	// Start the server
	log.Info("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
