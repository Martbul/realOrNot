package game

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
	duelMatchmaker "github.com/martbul/realOrNot/internal/games/duelMatchmaker"
	"github.com/martbul/realOrNot/internal/types"
	"github.com/martbul/realOrNot/pkg/logger"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func JoinDuel(duelMM *duelMatchmaker.Matchmaker, dbConn *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log := logger.GetLogger()

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error("WebSocket upgrade failed:", err)
			http.Error(w, "Failed to upgrade to WebSocket", http.StatusInternalServerError)
			return
		}

		done := make(chan struct{})

		conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		conn.SetPongHandler(func(string) error {
			conn.SetReadDeadline(time.Now().Add(60 * time.Second))
			return nil
		})

		var playerData struct {
			PlayerID string `json:"player_id"`
		}
		if err := conn.ReadJSON(&playerData); err != nil {
			log.Error("Error reading player data:", err)
			conn.WriteJSON(map[string]string{"error": "Invalid request payload"})
			return
		}

		player := &types.Player{
			ID:   playerData.PlayerID,
			Conn: conn,
		}

		go func() {
			for {
				select {
				case <-time.After(10 * time.Second):
					if inGame, ok := duelMM.PlayerStates.Load(player.ID); ok && inGame.(bool) {
						return // Exit loop if player is in a game
					}

					if err := conn.WriteJSON(map[string]string{
						"status":  "waiting",
						"message": "Still waiting for more players to join...",
					}); err != nil {
						log.Error("Waiting message failed, closing connection:", err)
						return
					}
				case <-done: // Exit loop if connection is closed
					return
				}
			}
		}()

		newSession, err := duelMM.DuelQueuePlayer(player, dbConn)
		if err != nil {
			log.Error("Error adding player to queue:", err)
			conn.WriteJSON(map[string]string{"error": "Internal server error"})
			return
		}

		if newSession != nil {
			if err := conn.WriteJSON(map[string]string{
				"status":   "game_found",
				"session":  newSession.ID,
				"message":  "Game session started!",
				"playerId": player.ID,
			}); err != nil {
				log.Error("Error notifying player about game session:", err)
			}
		}

		<-done

		log.Info("Closing WebSocket connection for player:", player.ID)
		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		conn.Close()
	}
}

func PlayStreak(dbConn *sqlx.DB) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

	}
}
