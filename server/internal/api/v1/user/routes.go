package user

import (
	"github.com/gorilla/mux"
	"go-gorilla-api/internal/api/v1/user/handler"
	"net/http"
)

// RegisterUserRoutes sets up the routes for user-related endpoints
func RegisterUserRoutes(r *mux.Router) {
	userRouter := r.PathPrefix("/users").Subrouter()
	userRouter.HandleFunc("", handler.CreateUser).Methods(http.MethodPost)
	userRouter.HandleFunc("/{id}", handler.GetUser).Methods(http.MethodGet)
	userRouter.HandleFunc("/{id}", handler.UpdateUser).Methods(http.MethodPut)
	userRouter.HandleFunc("/{id}", handler.DeleteUser).Methods(http.MethodDelete)
}
