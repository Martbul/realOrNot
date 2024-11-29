const url = "http://localhost:8080"
// authService.js
export const getLeaderboard = async () => {
	try {
		const response = await fetch(url + "/stats/leaderBoard", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to login. Please check your credentials.");
		}

		const data = await response.json();
		console.log(data)

		return data;
	} catch (error) {
		throw error;
	}
};

