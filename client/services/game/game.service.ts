const URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;
import { Game } from "@/utils/interfaces";
export const joinGame = (userId: string, game: Game, setGame: any) => {
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(URL + "/game/joinDuel");

		socket.onopen = () => {
			console.log("WebSocket connection established");
			socket.send(JSON.stringify({ player_id: userId }));
		};

		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				if (message.status === "queued") {
				} else if (message.status === "game_found") {
					resolve(message.session)
				} else if (message.status === "game_start") {
				} else if (message.round) {
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
				reject(new Error("Invalid message format"));
			}
		};

		socket.onerror = (event) => {
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
