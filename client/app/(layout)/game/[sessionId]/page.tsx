"use client";
import React, { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/gameContext";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import { use } from "react";
import Image from "next/image";

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

	const player1 = searchParams.get("player1");
	const player2 = searchParams.get("player2");



	const sendGuess = (guess: string) => {
		if (!game.ws || selectedImage || user == null) return;
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
	}, [game, sessionId]);

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
	}, [game, game.winners, router]);

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
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
					<div className="relative w-full">
						<div className="absolute left-0 top-[20%] sm:top-1/4 md:top-1/4 transform -translate-y-1/2 animate-slideInLeft text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-500 drop-shadow-2xl">
							<span className="animate-pulse text-blue-300 animate-neonFlicker">{player1}</span>
						</div>

						<div className="absolute right-0 top-[40%] sm:top-[45%] md:top-1/4 transform -translate-y-1/2 animate-slideInRight text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-500 drop-shadow-2xl">
							<span className="animate-pulse text-red-300 animate-neonFlicker">{player2}</span>
						</div>

						<div className="absolute inset-x-0 top-1/3 transform -translate-y-1/2 text-center text-5xl sm:text-6xl md:text-8xl font-extrabold text-yellow-500 animate-blink shadow-2xl">
							<span className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-transparent bg-clip-text animate-glow">VS</span>
						</div>

						<div className="absolute inset-x-0 top-[45%] text-center text-white text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider drop-shadow-2xl animate-pulse">
							<div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 text-transparent bg-clip-text animate-glow">
								{startGameTimer}
							</div>
						</div>

						<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800 opacity-60 animate-backgroundGlow"></div>
						<div className="absolute inset-0 z-10 pointer-events-none">
							<div className="absolute inset-0 animate-flashlight"></div>
							<div className="absolute inset-0 bg-gradient-to-t from-red-800 via-transparent to-blue-800 opacity-15 animate-colorWave"></div>
						</div>

						<div className="absolute inset-0 pointer-events-none">
							<div className="particle-layer animate-particleFlow"></div>
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
							<Image
								width={200}
								height={150}
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

















