package user

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/internal/util"
)

// CreateUser handles the creation of a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user types.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		util.WriteJSONResponse(w, http.StatusBadRequest, "Invalid input")
		return
	}

	createdUser, err := db.CreateUser(user)
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

	user, err := db.GetUserByID(id)
	if err != nil {
		util.WriteJSONResponse(w, http.StatusNotFound, err.Error())
		return
	}

	util.WriteJSONResponse(w, http.StatusOK, user)
}
