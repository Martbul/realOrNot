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

	fmt.Println("TESTING ROUNDS EXISTANE", gameRoundsData)
	return gameRoundsData, nil

}

func (ppm *PinPointSPGameMatchmaker) EvaluatePinPointSPGameResults(userID string, scoreArr []bool, dbConn *sqlx.DB) (int, error) {

	var score = 0
	for _, v := range scoreArr {
		if v == true {
			score++
		}
	}

	err := db.SavePinPointSPResult(dbConn, userID, score)
	//WARN: Improve error handling
	if err != nil {
		return -1, fmt.Errorf("Could not get persist pinPointSP score")
	}

	//WARN: ADD SCORE TO DB
	return score, nil

}
