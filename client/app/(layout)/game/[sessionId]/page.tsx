
'use client';
import React, { useEffect, useState } from "react";
import { joinGame } from "@/services/game/game.service";
import { useGameContext } from "@/contexts/gameContext";

const GamePage: React.FC<{ userId: string }> = ({ userId }) => {
	const [response, setResponse] = useState<string>("");
	const [timer, setTimer] = useState<number>(5); // Timer starts at 5 seconds
	const [showTimer, setShowTimer] = useState<boolean>(true); // Controls overlay visibility

	const { game, setGame } = useGameContext(); // Getting game context

	const sendGuess = (round: number, guess: string) => {
		//	if (!socket) return;

		//	const payload = { player_id: userId, guess };
		//	socket.send(JSON.stringify(payload));
		//	console.log("Sent guess:", payload);
		//	setResponse(""); // Clear response after sending
	};

	useEffect(() => {
		// Countdown logic
		if (timer > 0) {
			const timeout = setTimeout(() => setTimer((prev) => prev - 1), 1000);
			return () => clearTimeout(timeout);
		} else {
			setShowTimer(false); // Hide timer after countdown finishes
		}
	}, [timer]);

	useEffect(() => {
		console.log(game);
	}, [game]);

	if (!game) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<p className="text-lg font-medium text-gray-700">Loading game...</p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-gray-50 p-6">
			{/* Timer Overlay */}
			{showTimer && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					<div className="text-center">
						<p className="text-6xl font-bold text-white">{timer}</p>
						<p className="text-lg text-gray-300 mt-2">Get ready!</p>
					</div>
				</div>
			)}

			{/* Header */}
			<header className="text-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">
					Round {game.currentRound} of {game.totalRounds}
				</h1>
				<p className="text-gray-600 mt-2">Make your best guess to win!</p>
			</header>

			{/* Image Grid */}
			{game.roundData && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
					<div className="relative w-full h-64 sm:h-96">
						<img
							src={game.roundData.img_1_url}
							alt="Image 1"
							className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md"
						/>
					</div>
					<div className="relative w-full h-64 sm:h-96">
						<img
							src={game.roundData.img_2_url}
							alt="Image 2"
							className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md"
						/>
					</div>
				</div>
			)}

			{/* Guess Input */}
			<div className="max-w-lg mx-auto text-center">
				<input
					type="text"
					value={response}
					onChange={(e) => setResponse(e.target.value)}
					placeholder="Enter your guess"
					className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<button
					onClick={() => sendGuess(game.currentRound, response)}
					className="w-full mt-4 p-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700"
				>
					Submit Guess
				</button>
			</div>
		</div>
	);
};

export default GamePage;
