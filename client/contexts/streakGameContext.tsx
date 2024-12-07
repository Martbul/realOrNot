"use client";

import { StreakGame, StreakGameContextType } from "@/utils/interfaces";
import React, { createContext, useContext, useState } from "react";

const StreakGameContext = createContext<StreakGameContextType>({
	streakGame: {
		currentRound: null,
		playerRecordStreak: 0,
		player: null,
		score: 0,
		sessionId: null,
		roundData: {},
		ws: null,
	},
	setStreakGame: () => { },
});

export function StreakGameContextWrapper({ children }: { children: React.ReactNode }) {
	const [streakGame, setStreakGame] = useState<StreakGame>({
		currentRound: null,
		playerRecordStreak: 0,
		roundData: {},
		player: null,
		score: 0,
		sessionId: null,
		ws: null,
	});

	const contextValue: StreakGameContextType = {
		streakGame,
		setStreakGame,
	};

	return (
		<StreakGameContext.Provider value={contextValue}>{children}</StreakGameContext.Provider>
	);
}

export function useStreakGameContext() {
	return useContext(StreakGameContext);
}
