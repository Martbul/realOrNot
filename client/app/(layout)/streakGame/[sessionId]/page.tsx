"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { use } from "react"; // Import use() for unwrapping promises
import { useStreakGameContext } from "@/contexts/streakGameContext";

interface StreakGamePageProps {
	params: Promise<{
		sessionId: string;
	}>;
}

const StreakGamePage: React.FC<StreakGamePageProps> = ({ params }) => {
	const [startGameTimer, setStartGameTimer] = useState<number>(5);
	const [guessTimer, setGuessTimer] = useState<number>(10);
	const [showTimer, setShowTimer] = useState<boolean>(true);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showWinners, setShowWinners] = useState<boolean>(false);

	const { streakGame } = useStreakGameContext();
	const { user } = useAuthContext();
	const router = useRouter();

	// Resolve params
	const { sessionId } = use(params);

	const sendGuess = (guess: string) => {
		if (!streakGame.ws || selectedImage) return;
		const payload = { player_id: user, guess };
		streakGame.ws.send(JSON.stringify(payload));
		console.log("Sent guess:", payload);
		setSelectedImage(guess);
	};

	useEffect(() => {
		setStartGameTimer(5);
		setGuessTimer(10);
		setShowTimer(true);
		setShowWinners(false);
		setSelectedImage(null);

		if (streakGame) {
			streakGame.finalScore = []; // Reset winners list
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
		if (streakGame && streakGame.roundData) {
			setSelectedImage(null);
			setGuessTimer(10);
		}
	}, [streakGame]);

	useEffect(() => {
		if (streakGame.finalScore) {
			setShowWinners(true);
			setTimeout(() => {
				router.push("/"); // Redirect to home page after 5 seconds
			}, 5000); // Adjust the timeout duration as needed
		}
	}, [streakGame.finalScore, router]);

	if (!streakGame) {
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
					{streakGame.finalScore && (

						<p className="text-2xl font-medium text-yellow-300">
							{streakGame.finalScore}
						</p>
					)}
					<p className="text-lg text-gray-300 mt-2">
						Redirecting to the home page in 5 seconds...
					</p>
				</div>
			)}

			{showTimer && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
					<div className="text-center">
						<p className="text-6xl font-bold text-white">{startGameTimer}</p>
						<p className="text-lg text-gray-300 mt-2">Get ready!</p>
					</div>
				</div>
			)}

			<div className="text-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">
					Round {streakGame.currentRound}
				</h1>
				<p className="text-gray-600 mt-2">Make your best guess to win!</p>
			</div>

			<div className="text-center mb-4">
				<p className="text-xl font-bold text-gray-800">
					Time Remaining: <span className="text-red-600">{guessTimer}s</span>
				</p>
			</div>

			{streakGame.roundData && streakGame.roundData.lenght > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
					{["img_1_url", "img_2_url"].map((key, index) => (
						<div
							key={key}
							className={`relative w-full h-64 sm:h-96 rounded-lg shadow-md cursor-pointer 
              ${selectedImage
									? selectedImage === streakGame.roundData[key]
										? "border-4 border-green-500"
										: "opacity-50 cursor-not-allowed"
									: "hover:scale-105 hover:border-4 hover:border-indigo-500 transform transition duration-300"
								}`}
							onClick={() => {
								if (!selectedImage) sendGuess(streakGame.roundData[key]);
							}}
						>
							<img
								src={streakGame.roundData[key]}
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

export default StreakGamePage;












