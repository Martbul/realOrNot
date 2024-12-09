import { Dispatch, SetStateAction } from "react";

export interface User {
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
  currentRound: any;
  totalRounds: number;
  players: any[]; // Assuming players is an array of any type, update if more specific types are available
  scores: { [key: string]: number }; // Assuming scores is an object mapping player IDs to scores
  roundData: any;
  sessionId: any;
  ws: any;
  winners: string[]; // Updated to explicitly be an array of strings
}


export interface StreakGameContextType {

  streakGame: StreakGame;
  setStreakGame: Dispatch<SetStateAction<StreakGame>>;
}

export interface StreakGame {
  currentRound: any;
  playerRecordStreak: number;
  player: any;
  score: number;
  roundData: any;
  sessionId: any;
  finalScore: any,
  ws: any;
}

export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  transformOrigin?: string;
}
