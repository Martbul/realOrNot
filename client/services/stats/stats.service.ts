const URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;
export const getLeaderboard = async () => {
	try {
		const response = await fetch(URL + "/stats/leaderboard", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to get duelLeaderboard");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
};


export const getPinPointSPTopPlayers = async () => {
	try {
		const response = await fetch(URL + "/stats/pinPointSPTopPlayers", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to get pinPointSPTopPlayers");
		}

		const data = await response.json();
		console.log(data)
		return data;
	} catch (error) {
		throw error;
	}
};


export const getStreakTopPlayers = async () => {
	try {
		const response = await fetch(URL + "/stats/streakTopPlayers", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to get streakTopPlayers");
		}

		const data = await response.json();
		console.log(data)
		return data;
	} catch (error) {
		throw error;
	}
};


export const getDuelTopPlayers = async () => {
	try {
		const response = await fetch(URL + "/stats/duelTopPlayers", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to get duelTopPlayers");
		}

		const data = await response.json();
		console.log(data)
		return data;
	} catch (error) {
		throw error;
	}
};


export const getProfileStats = async (userId: string) => {
	try {
		const response = await fetch(URL + "/stats/profile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: userId
			})
		});

		if (!response.ok) {
			throw new Error("Failed to get proofile stats");
		}

		const data = await response.json();
		console.log(data)
		return data;
	} catch (error) {
		throw error;
	}
};

