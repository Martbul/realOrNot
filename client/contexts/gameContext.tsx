"use client";

import { Game, GameContextType } from "@/utils/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext<GameContextType>({
	game: { currentRound: null, totalRounds: 5, scores: {}, images: [], sessionId: null },
	setGame: () => { },
});

export function GameContextWrapper({ children }: { children: React.ReactNode }) {
	const [game, setGame] = useState<Game>({
		currentRound: null,
		totalRounds: 5,
		scores: {},
		images: [],
		sessionId: null
	});

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


