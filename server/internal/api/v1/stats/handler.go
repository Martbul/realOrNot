package stats

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

type LeaderboardUserData struct {
	ID       int
	UserName string
	Wins     int
}

func DuelWinsLeaderboard(dbConn *sqlx.DB) http.HandlerFunc {
	log := logger.GetLogger()
	return func(w http.ResponseWriter, r *http.Request) {
		lbPlayerStats, err := db.GetDuelWinsLeaderboard(dbConn)
		if err != nil {
			log.Error("Cannot fetch duel wins leaderboard: %v", err)

			http.Error(w, "Failed to fetch duel wins leaderboard", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(lbPlayerStats); err != nil {
			log.Error("Cannot encode duel wins leaderboard to JSON: %v", err)
			http.Error(w, "Failed to process leaderboard data", http.StatusInternalServerError)
			return
		}
	}
}

func PinPointSPTopPlayers(dbConn *sqlx.DB) http.HandlerFunc {
	log := logger.GetLogger()
	return func(w http.ResponseWriter, r *http.Request) {
		pinPointSPTopPlayers, err := db.GetPinPointSPTopPlayers(dbConn)
		if err != nil {
			log.Error("Cannot fetch pinPointSP top players: %v", err)

			http.Error(w, "Failed to fetch pinPointSP top players", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(pinPointSPTopPlayers); err != nil {
			log.Error("Cannot encode pinPointSP top players to JSON: %v", err)
			http.Error(w, "Failed to process pinPointSP top players data", http.StatusInternalServerError)
			return
		}
	}
}

func StreakTopPlayers(dbConn *sqlx.DB) http.HandlerFunc {
	log := logger.GetLogger()
	return func(w http.ResponseWriter, r *http.Request) {
		streakTopPlayers, err := db.GetStreakTopPlayers(dbConn)
		if err != nil {
			log.Error("Cannot fetch streak top players: %v", err)

			http.Error(w, "Failed to fetch streak top players", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(streakTopPlayers); err != nil {
			log.Error("Cannot encode duel top players to JSON: %v", err)
			http.Error(w, "Failed to process streak top players data", http.StatusInternalServerError)
			return
		}
	}
}

func DuelTopPlayers(dbConn *sqlx.DB) http.HandlerFunc {
	log := logger.GetLogger()
	return func(w http.ResponseWriter, r *http.Request) {
		duelTopPlayers, err := db.GetDuelTopPlayers(dbConn)
		if err != nil {
			log.Error("Cannot fetch duel top players: %v", err)

			http.Error(w, "Failed to fetch duel top players", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(duelTopPlayers); err != nil {
			log.Error("Cannot encode duel top players to JSON: %v", err)
			http.Error(w, "Failed to process duel top players data", http.StatusInternalServerError)
			return
		}
	}
}
func ProfileStats(dbConn *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.ProfileStatsRequest
		log := logger.GetLogger()

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		profileStats, err := db.GetProfileStats(dbConn, req.UserId)
		if err != nil {
			log.Error("Cannot fetch profile stats: %v", err)

			http.Error(w, "Failed to fetch profile statistics", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(profileStats); err != nil {
			log.Error("Cannot encode profile stats to JSON: %v", err)
			http.Error(w, "Failed to process profile statistics", http.StatusInternalServerError)
			return
		}
	}
}
