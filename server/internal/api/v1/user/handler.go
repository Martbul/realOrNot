package user

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	dbPackage "github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/internal/util"
	"github.com/martbul/realOrNot/pkg/logger"
	"golang.org/x/crypto/bcrypt"
)

func SignupUser(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.SignupRequest

		log := logger.GetLogger()

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}

		user := &types.User{
			UserName:       req.Username,
			Email:          req.Email,
			HashedPassword: string(hashedPassword),
		}

		if err := dbPackage.CreateUser(db, user); err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		token, err := util.GenerateJWT(req.Username, req.Email)
		if err != nil {
			http.Error(w, "Could not generate token", http.StatusInternalServerError)
			return
		}

		log.Info("Successful user signup")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"JWT": token, "id": user.Id, "email": user.Email})
	}
}

func LoginUser(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.LoginRequest
		log := logger.GetLogger()

		if db == nil {
			log.Error("Database connection is nil")
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		user, err := dbPackage.GetUserByEmail(db, req.Email)
		if err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(req.Password)); err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		token, err := util.GenerateJWT(user.UserName, req.Email)
		if err != nil {
			http.Error(w, "Could not generate token", http.StatusInternalServerError)
			return
		}

		log.Info("Successful user login")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"JWT": token, "id": user.Id, "email": user.Email})
	}
}

func GetUser(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user types.User
		id := mux.Vars(r)["id"]
		query := "SELECT id, username FROM users WHERE id = $1"

		if err := db.Get(&user, query, id); err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	}
}
