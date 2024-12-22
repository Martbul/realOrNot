package pinPointSPGameMatchmaker

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/martbul/realOrNot/internal/db"
	"github.com/martbul/realOrNot/internal/types"
)

type PinPointSPGameMatchmaker struct {
}

func NewPinPointSPGameMatchmaker() *PinPointSPGameMatchmaker {
	return &PinPointSPGameMatchmaker{}
}

func (ppm *PinPointSPGameMatchmaker) StartPinPointSPGame(dbConn *sqlx.DB) ([]types.PinPointRoundData, error) {
	gameRoundsData, err := db.GetPinPointSPRoundData(dbConn)
	//WARN: Improve error handling
	if err != nil {
		return nil, fmt.Errorf("Could not get rounds for pinpointsgame")
	}

	return gameRoundsData, nil

}

func (ppm *PinPointSPGameMatchmaker) EvaluatePinPointSPGameResults(dbConn *sqlx.DB) {

}
