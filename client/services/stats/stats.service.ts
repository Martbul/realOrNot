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
			throw new Error("Failed to login. Please check your credentials.");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
};

