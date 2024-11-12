const url = "http://localhost:3000/user/auth"
// authService.js
export const login = async (email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch("https://your-server-url.com/api/login", {
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

		// Assuming `data` contains user information and a token
		setUser(data.user); // Update user in auth context

		//localStorage.setItem("accessToken", accessToken);
		//  localStorage.setItem("refreshToken", refreshToken);
		//localStorage.setItem("user", JSON.stringify(user));

		//return { user, accessToken, refreshToken, success: true };
		return data;
	} catch (error) {
		throw error;
	}
};



// authService.js
export const signup = async (email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch("https://your-server-url.com/api/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Failed to sign up. Please check your information.");
		}

		const data = await response.json();

		// Assuming `data` contains user information and a token
		setUser(data.user); // Update user in auth context

		// Optional: store tokens or user data locally
		// localStorage.setItem("accessToken", data.accessToken);
		// localStorage.setItem("refreshToken", data.refreshToken);
		// localStorage.setItem("user", JSON.stringify(data.user));

		return data;
	} catch (error) {
		throw error;
	}
};
