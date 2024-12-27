import { Game, StreakGame } from "@/utils/interfaces";

const URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;

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
					resolve({ session: message.session, players: message.players })

					console.log(message)
				} else if (message.status === "game_start") {
				} else if (message.round) {
					console.log(message.round)
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



export const playStreakGame = (userId: string, game: StreakGame, setStreakGame: any) => {
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(URL + "/game/playStreak");

		socket.onopen = () => {
			console.log("WebSocket connection established");
			socket.send(JSON.stringify({ player_id: userId }));
		};

		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				if (message.status === "Loading") {
					console.log("Loading status", message);
				} else if (message.status === "game_start") {
					resolve(message.session)
					console.log("gameStart", message);
				} else if (message.round) {

					console.log("gameRound", message);
					setStreakGame((prevGame: StreakGame) => ({
						...prevGame,
						currentRound: message.round,
						roundData: message.roundData,
						ws: socket,
					}));
				} else if (message.status === "game_end") {
					console.log("Game ended:", message);
					setStreakGame((prevGame: StreakGame) => ({
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

export const getPinPointGameData = async () => {
	try {
		const response = await fetch(URL + "/game/getPinPointRoundData", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",

			},

		})

		if (!response.ok) {
			throw new Error("FAiled to get pinpointsp data")
		}

		const data = await response.json()
		return data

	} catch (error) {
		console.error(error)
		throw error;
	}

}


export const evaluatePinPointSPGameResults = async (userId: string, score: boolean[]) => {
	try {
		const response = await fetch(URL + "/game/pinPointSPResults", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: userId,
				score: score,
			}),
		});

		const responseBody = await response.text();

		console.log("Response body:", responseBody);

		if (!responseBody) {
			throw new Error("No response body received");
		}

		let data;
		try {
			data = JSON.parse(responseBody);
		} catch (error) {
			throw new Error("Failed to parse JSON response: " + error.message);
		}

		if (!response.ok) {
			throw new Error("Failed to get evaluate pinPointGame result");
		}

		return data;

	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};



export const login = async (email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch(URL + "/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Failed to login. Please check your credentials.");
		}

		const data = await response.json();

		setUser({ id: data.id, username: data.username });
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("userId", data.id);
		localStorage.setItem("username", data.username);
		localStorage.setItem("refreshToken", data.refreshToken);

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};


