'use client'
import React, { useEffect, useState } from "react";
import { joinGame } from "@/services/game/game.service";
import { useGameContext } from "@/contexts/gameContext";

const GamePage: React.FC<{ userId: string }> = ({ userId }) => {
	const [response, setResponse] = useState<string>("");

	const { game, setGame } = useGameContext(); // Getting user from the context

	const sendGuess = (round: number, guess: string) => {
		//	if (!socket) return;

		//	const payload = { player_id: userId, guess };
		//	socket.send(JSON.stringify(payload));
		//	console.log("Sent guess:", payload);
		//	setResponse(""); // Clear response after sending
	};

	useEffect(() => {
		console.log(game)
	}, [game])
	if (!game) {
		return <div>Loading game...</div>;
	}

	return (
		<div>
			<h1>
				Round {game.currentRound} of {game.totalRounds}
			</h1>

			<div className="image-grid">
				{game.images.map((image, index) => (
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
			<button onClick={() => sendGuess(game.currentRound, response)}>Submit</button>
		</div>
	);
};

export default GamePage;
