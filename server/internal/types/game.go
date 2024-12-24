package types

import (
	"github.com/gorilla/websocket"
)

type Player struct {
	ID       string
	Conn     *websocket.Conn
	Username string
	Score    int
}

type Round struct {
	Img1URL string `db:"img_1_url" json:"img_1_url"`
	Img2URL string `db:"img_2_url" json:"img_2_url"`
	Correct string `db:"correct" json:"correct"`
}

type PinPointRoundData struct {
	ImgURL string `db:"image_url"`
	X      int    `db:"x"`
	Y      int    `db:"y"`
	Width  int    `db:"width"`
	Height int    `db:"height"`
}
