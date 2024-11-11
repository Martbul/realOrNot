// websocket.go
package websocket

import (
	"github.com/gorilla/websocket"
	"log"
)

func SendMessage(conn *websocket.Conn, message interface{}) error {
	err := conn.WriteJSON(message)
	if err != nil {
		log.Println("Error sending message:", err)
	}
	return err
}

func ReceiveMessage(conn *websocket.Conn, v interface{}) error {
	err := conn.ReadJSON(v)
	if err != nil {
		log.Println("Error receiving message:", err)
	}
	return err
}
