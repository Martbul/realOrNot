
import { Game } from "@/utils/interfaces";
export const joinGame = (userId: string, game: Game, setGame: any) => {
	const socketUrl = "ws://localhost:8080/game/join"; // Use `wss://` if on HTTPS
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(socketUrl);

		socket.onopen = () => {
			console.log("WebSocket connection established");
			// Send the player ID as JSON
			socket.send(JSON.stringify({ player_id: userId }));
		};

		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				// Handle server responses
				if (message.status === "queued") {
					console.log("Queued:", message.message);
				} else if (message.status === "game_found") {
					console.log("Game found:", message);
					//	gameState.sessionId = message.session;
					//	resolve({ socket, gameState });
					resolve(message.session)
				} else if (message.status === "game_start") {
					console.log("Game starting:", message);
					//gameState.totalRounds = parseInt(message.rounds, 10) || 5;
				} else if (message.round) {
					console.log("New round started:", message);

					setGame((prevGame: Game) => ({
						...prevGame,
						currentRound: message.round,
						roundData: message.roundData,
						ws: socket,
					}));
				} else if (message.status === "game_end") {
					console.log("Game ended:", message);
					setGame((prevGame: Game) => ({
						...prevGame,
						winners: message.winners

					}));
					socket.close();
				}
			} catch (error) {
				console.error("Error parsing server message:", error);
				reject(new Error("Invalid message format"));
			}
		};

		socket.onerror = (event) => {
			console.error("WebSocket error:", event);
			reject(new Error("WebSocket error occurred"));
		};

		socket.onclose = (event) => {
			if (!event.wasClean) {
				console.warn("WebSocket connection closed unexpectedly");
			} else {
				console.log("WebSocket connection closed");
			}
		};
	});
};
