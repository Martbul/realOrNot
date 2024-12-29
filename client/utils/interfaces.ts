import { Dispatch, SetStateAction } from "react";

export interface User {
  id: string
  username: string | null
}


export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export interface GameContextType {

  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
}

export interface Game {
  currentRound: any;
  totalRounds: number;
  players: any[];
  scores: { [key: string]: number };
  roundData: any;
  sessionId: any;
  ws: any;
  winners: string[];
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
