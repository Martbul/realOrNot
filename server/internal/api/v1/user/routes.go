package user

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

// RegisterUserRoutes sets up the routes for user-related endpoints
func RegisterUserRoutes(r *mux.Router, db *sqlx.DB) {
	userRouter := r.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("/signup", SignupUser(db)).Methods(http.MethodPost)
	userRouter.HandleFunc("/login", LoginUser(db)).Methods(http.MethodPost)
	userRouter.HandleFunc("/{id}", GetUser(db)).Methods(http.MethodGet)
	//userRouter.HandleFunc("/{id}", UpdateUser).Methods(http.MethodPut)
	//userRouter.HandleFunc("/{id}", DeleteUser).Methods(http.MethodDelete)
}
