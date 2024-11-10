package user

import (
	"github.com/gorilla/mux"
	"net/http"
)

// RegisterUserRoutes sets up the routes for user-related endpoints
func RegisterUserRoutes(r *mux.Router) {
	userRouter := r.PathPrefix("/users").Subrouter()
	userRouter.HandleFunc("", CreateUser).Methods(http.MethodPost)
	userRouter.HandleFunc("/{id}", GetUser).Methods(http.MethodGet)
	//userRouter.HandleFunc("/{id}", UpdateUser).Methods(http.MethodPut)
	//userRouter.HandleFunc("/{id}", DeleteUser).Methods(http.MethodDelete)
}
