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

func (ppm *PinPointSPGameMatchmaker) EvaluatePinPointSPGameResults(userID string, scoreArr []bool, dbConn *sqlx.DB) (int, error) {
	var score = 0
	for _, v := range scoreArr {
		if v == true {
			score++
		}
	}
	if score >= 3 {

		err := db.AddPlayerPinPointSPWin(dbConn, userID)
		//WARN: Improve error handling
		if err != nil {
			return -1, fmt.Errorf("Could not get persist pinPointSP score")
		}

		err = db.AddPlayerGamesWin(dbConn, userID)

		//WARN: Improve error handling
		if err != nil {
			return -1, fmt.Errorf("Could not get persist pinPointSP score")
		}

		err = db.AddPlayerAllGamesPlayed(dbConn, userID)

		//WARN: Improve error handling
		if err != nil {
			return -1, fmt.Errorf("Could not get persist pinPointSP score")
		}

		err = db.AddPlayerPinPointSPGamesPlayed(dbConn, userID)
		//WARN: Improve error handling
		if err != nil {
			return -1, fmt.Errorf("Could not get persist pinPointSP score")
		}

	}
	return score, nil

}
