'use client'
import React, { useEffect, useState } from "react";
import { joinGame } from "@/services/game/game.service";

const GamePage: React.FC<{ userId: string }> = ({ userId }) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [gameState, setGameState] = useState<{
		round: number;
		totalRounds: number;
		scores: Record<string, number>;
		images: string[];
		sessionId: string | null;
	} | null>(null);
	const [response, setResponse] = useState<string>("");

	useEffect(() => {
		const startGame = async () => {
			try {
				const { socket: gameSocket, gameState: initialGameState } = await joinGame(userId);
				setSocket(gameSocket);
				setGameState(initialGameState);
			} catch (error) {
				console.error("Error joining game:", error);
			}
		};

		startGame();

		return () => {
			socket?.close(); // Clean up WebSocket on component unmount
		};
	}, [userId]);

	const sendGuess = (round: number, guess: string) => {
		if (!socket) return;

		const payload = { player_id: userId, guess };
		socket.send(JSON.stringify(payload));
		console.log("Sent guess:", payload);
		setResponse(""); // Clear response after sending
	};

	if (!gameState) {
		return <div>Loading game...</div>;
	}

	return (
		<div>
			<h1>
				Round {gameState.round} of {gameState.totalRounds}
			</h1>

			{/* Display images for the current round */}
			<div className="image-grid">
				{gameState.images.map((image, index) => (
					<img key={index} src={image} alt={`Image ${index + 1}`} />
				))}
			</div>

			{/* Input for submitting user response */}
			<input
				type="text"
				value={response}
				onChange={(e) => setResponse(e.target.value)}
				placeholder="Enter your guess"
			/>
			<button onClick={() => sendGuess(gameState.round, response)}>Submit</button>
		</div>
	);
};

export default GamePage;
