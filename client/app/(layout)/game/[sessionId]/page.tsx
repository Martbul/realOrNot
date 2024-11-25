




'use client';
import React, { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/gameContext";
import { useAuthContext } from "@/contexts/authContext";

const GamePage: React.FC = ({ params }) => {
	const [startGameTimer, setStartGameTimer] = useState<number>(5);
	const [guessTimer, setGuessTimer] = useState<number>(10);
	const [showTimer, setShowTimer] = useState<boolean>(true); // Controls overlay visibility
	const [selectedImage, setSelectedImage] = useState<string | null>(null); // Track selected image
	//const [winners, setWinners] = useState<string[]>([]); // State to track winners
	const { game } = useGameContext();
	const { user } = useAuthContext();

	const sendGuess = (guess: string) => {
		if (!game.ws || selectedImage) return; // Prevent further guesses after selection

		const payload = { "player_id": user, guess };
		game.ws.send(JSON.stringify(payload));
		console.log("Sent guess:", payload);

		setSelectedImage(guess); // Set the selected image to prevent further clicks
	};

	// Countdown for the start timer
	useEffect(() => {
		if (startGameTimer > 0) {
			const timeout = setTimeout(() => setStartGameTimer((prev) => prev - 1), 1000);
			return () => clearTimeout(timeout);
		} else {
			setShowTimer(false); // Hide start timer after countdown finishes
		}
	}, [startGameTimer]);

	// Countdown for the guess timer
	useEffect(() => {
		if (!showTimer && guessTimer > 0) {
			const timeout = setTimeout(() => setGuessTimer((prev) => prev - 1), 1000);
			return () => clearTimeout(timeout);
		}
	}, [showTimer, guessTimer]);

	useEffect(() => {
		console.log(game);
		console.log(user);
		// Reset the selected image when a new round starts
		if (game && game.roundData) {
			setSelectedImage(null); // Clear the selection for a new round
			setGuessTimer(10); // Reset the guess timer for the next round
		}
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
						<p className="text-6xl font-bold text-white">{startGameTimer}</p>
						<p className="text-lg text-gray-300 mt-2">Get ready!</p>
					</div>
				</div>
			)}



			{game.winners && game.winners.length > 0 && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					{game.winners.map((w, index) => (
						<div key={index} className="text-center">
							<p className="text-lg text-gray-300 mt-2">{w}</p>
						</div>
					))}
				</div>
			)}


			{/* Header */}
			<header className="text-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">
					Round {game.currentRound} of {game.totalRounds}
				</h1>
				<p className="text-gray-600 mt-2">Make your best guess to win!</p>
			</header>

			{/* Guess Timer */}
			<div className="text-center mb-4">
				<p className="text-xl font-bold text-gray-800">
					Time Remaining: <span className="text-red-600">{guessTimer}s</span>
				</p>
			</div>

			{/* Image Grid */}
			{game.roundData && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
					{["img_1_url", "img_2_url"].map((key, index) => (
						<div
							key={key}
							className={`relative w-full h-64 sm:h-96 rounded-lg shadow-md cursor-pointer 
              ${selectedImage
									? selectedImage === game.roundData[key]
										? "border-4 border-green-500"
										: "opacity-50 cursor-not-allowed"
									: "hover:scale-105 hover:border-4 hover:border-indigo-500 transform transition duration-300"
								}`}
							onClick={() => {
								if (!selectedImage) sendGuess(game.roundData[key]);
							}}
						>
							<img
								src={game.roundData[key]}
								alt={`Image ${index + 1}`}
								className="absolute inset-0 w-full h-full object-contain"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default GamePage;







