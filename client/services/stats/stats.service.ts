const url = "http://localhost:8080"
export const getLeaderboard = async () => {

	console.log("getting leaderboard")
	try {
		const response = await fetch(url + "/stats/leaderboard", {
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

