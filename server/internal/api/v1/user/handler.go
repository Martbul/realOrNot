package handler

import (
	"encoding/json"
	"go-gorilla-api/internal/model"
	"go-gorilla-api/internal/service/user"
	"go-gorilla-api/internal/util"
	"net/http"
)

// CreateUser handles the creation of a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		util.WriteJSONResponse(w, http.StatusBadRequest, "Invalid input")
		return
	}

	createdUser, err := user.Create(user)
	if err != nil {
		util.WriteJSONResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	util.WriteJSONResponse(w, http.StatusCreated, createdUser)
}

// GetUser handles fetching a user by ID
func GetUser(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL
	id := mux.Vars(r)["id"]

	user, err := user.GetByID(id)
	if err != nil {
		util.WriteJSONResponse(w, http.StatusNotFound, err.Error())
		return
	}

	util.WriteJSONResponse(w, http.StatusOK, user)
}
