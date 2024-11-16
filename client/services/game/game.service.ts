const url = "http://localhost:8080/"


export const joinGame = async (userId:string) => {
	console.log("CLIENT JOINING A GAME REQ")
	console.log(userId)
	try {
		const response = await fetch(url + "/game/join", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ player_id: userId}),
		});

		if (!response.ok) {
			throw new Error("ERROR WHEN JOINING A GAME");
		}

		const data = await response.json();
		console.log(data)
		return data;


	} catch (error) {
		throw error;
	}
};


