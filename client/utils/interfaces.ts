import { Dispatch, SetStateAction } from "react";

export interface User {
  //username: string;
  //email: string | undefined;
  id: string
}

export interface AuthContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export interface GameContextType {

  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
}

export interface Game {
  currentRound: any,
  totalRounds: number,
  players: [],
  scores: {},
  roundData: any,
  sessionId: any,
  ws: any,
}
