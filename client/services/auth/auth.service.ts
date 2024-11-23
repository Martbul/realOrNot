const url = "http://localhost:8080/user"
// authService.js
export const login = async (email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch(url + "/login", {
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
		console.log(data)

		// Assuming `data` contains user information and a token
		setUser(data.user); // Update user in auth context

		//localStorage.setItem("accessToken", accessToken);
		//  localStorage.setItem("refreshToken", refreshToken);
		//localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("jwt", JSON.stringify(data.JWT))
		localStorage.setItem("userEmail", JSON.stringify(data.email));
		localStorage.setItem("userId", JSON.stringify(data.id));


		//return { user, accessToken, refreshToken, success: true };
		return data;
	} catch (error) {
		throw error;
	}
};



// authService.js
export const signup = async (username: string, email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch(url + "/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		});

		if (!response.ok) {
			throw new Error("Failed to sign up. Please check your information.");
		}

		const data = await response.json();
		console.log(data)

		setUser(() => ({ id: data.id }));
		const userObject = { id: data.id, email: data.email };
		localStorage.setItem("user", JSON.stringify(userObject));

		// Optional: store tokens or user data locally
		// localStorage.setItem("accessToken", data.accessToken);
		//localStorage.setItem("refreshToken", data.refreshToken);
		localStorage.setItem("jwt", JSON.stringify(data.JWT))
		localStorage.setItem("userEmail", JSON.stringify(data.email));
		localStorage.setItem("userId", JSON.stringify(data.id));


		return data;
	} catch (error) {
		throw error;
	}
};
