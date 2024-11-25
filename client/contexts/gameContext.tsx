"use client";

import { Game, GameContextType } from "@/utils/interfaces";
import React, { createContext, useContext, useState } from "react";


// Create the GameContext with default values
const GameContext = createContext<GameContextType>({
	game: {
		currentRound: null,
		totalRounds: 5,
		players: [],
		scores: {},
		winners: [],
		sessionId: null,
		roundData: {},
		ws: null,
	},
	setGame: () => { },
});

export function GameContextWrapper({ children }: { children: React.ReactNode }) {
	// State to manage the game object
	const [game, setGame] = useState<Game>({
		currentRound: null,
		totalRounds: 5,
		roundData: {},
		players: [],
		scores: {},
		winners: [],
		sessionId: null,
		ws: null,
	});

	// Context value containing the game state and updater function
	const contextValue: GameContextType = {
		game,
		setGame,
	};

	return (
		<GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
	);
}

export function useGameContext() {
	return useContext(GameContext);
}
