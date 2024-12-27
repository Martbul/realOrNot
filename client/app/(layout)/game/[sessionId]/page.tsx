

"use client";
import React, { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/gameContext";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import { use } from "react";

interface GamePageProps {
	params: Promise<{
		sessionId: string;
	}>;
}

const GamePage: React.FC<GamePageProps> = ({ params }) => {
	const [startGameTimer, setStartGameTimer] = useState<number>(5);
	const [guessTimer, setGuessTimer] = useState<number>(10);
	const [showTimer, setShowTimer] = useState<boolean>(true);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showWinners, setShowWinners] = useState<boolean>(false);

	const { game } = useGameContext();
	const { user } = useAuthContext();
	const router = useRouter();

	const { sessionId } = use(params);
	const searchParams = useSearchParams();

	// Accessing query parameters
	const exampleParam = searchParams.get("exampleParam");
	const anotherParam = searchParams.get("anotherParam");



	useEffect(() => {
		if (exampleParam) {
			console.log("Query Params:", exampleParam);
		}
	}, [exampleParam]);

	const sendGuess = (guess: string) => {
		if (!game.ws || selectedImage) return;
		const payload = { player_id: user.id, guess };
		game.ws.send(JSON.stringify(payload));
		console.log("Sent guess:", payload);
		setSelectedImage(guess);
	};

	useEffect(() => {
		setStartGameTimer(5);
		setGuessTimer(10);
		setShowTimer(true);
		setShowWinners(false);
		setSelectedImage(null);

		if (game) {
			game.winners = [];
		}
	}, [sessionId]);

	useEffect(() => {
		if (startGameTimer > 0) {
			const timeout = setTimeout(() => setStartGameTimer((prev) => prev - 1), 1000);
			return () => clearTimeout(timeout);
		} else {
			setShowTimer(false);
		}
	}, [startGameTimer]);

	useEffect(() => {
		if (!showTimer && guessTimer > 0) {
			const timeout = setTimeout(() => setGuessTimer((prev) => prev - 1), 1000);
			return () => clearTimeout(timeout);
		}
	}, [showTimer, guessTimer]);

	useEffect(() => {
		if (game && game.roundData) {
			setSelectedImage(null);
			setGuessTimer(10);
		}
	}, [game]);

	useEffect(() => {
		if (game.winners && game.winners.length > 0) {
			setShowWinners(true);
			setTimeout(() => {
				router.push("/");
			}, 5000);
		}
	}, [game.winners, router]);

	if (!game) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<p className="text-lg font-medium text-gray-700">Loading game...</p>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen bg-gray-50 p-6">
			{showWinners && <Confetti width={window.innerWidth} height={window.innerHeight} />}

			{showWinners && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					<h2 className="text-4xl font-bold text-white mb-4">🎉 Congratulations! 🎉</h2>
					{game.winners.map((winner, index) => (
						<p key={index} className="text-2xl font-medium text-yellow-300">
							{winner}
						</p>
					))}
					<p className="text-lg text-gray-300 mt-2">
						Redirecting to the home page in 5 seconds...
					</p>
				</div>
			)}

			{showTimer && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					<div className="relative w-full">
						{/* Player Names Animation */}
						<div className="absolute left-0 top-1/3 transform -translate-y-1/2 animate-slideInLeft text-4xl font-bold text-indigo-500">
							PLAYER1
						</div>
						<div className="absolute right-0 top-1/3 transform -translate-y-1/2 animate-slideInRight text-4xl font-bold text-green-500">
							PLAYER2
						</div>
						{/* Timer Display */}
						<div className="text-center text-white text-6xl font-bold">
							{startGameTimer}
						</div>
					</div>
				</div>
			)}

			<div className="text-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">
					Round {game.currentRound} of {game.totalRounds}
				</h1>
				<p className="text-gray-600 mt-2">Make your best guess to win!</p>
			</div>

			<div className="text-center mb-4">
				<p className="text-xl font-bold text-gray-800">
					Time Remaining: <span className="text-red-600">{guessTimer}s</span>
				</p>
			</div>

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

















