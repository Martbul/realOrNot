//const url = "http://localhost:8080/user"
const URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;
// authService.js
export const login = async (email: string, password: string, setUser: Function) => {
	try {
		const response = await fetch(URL + "/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			//			credentials: "include", // Ensures cookies are sent/received
		});

		if (!response.ok) {
			throw new Error("Failed to login. Please check your credentials.");
		}

		const data = await response.json();

		setUser(data.id); // Update user in context
		localStorage.setItem("accessToken", data.accessToken); // Temporary storage (optional)
		localStorage.setItem("userId", data.id); // Update access token
		localStorage.setItem("refreshToken", data.refreshToken); // Update access token

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const logout = async (setUser: Function) => {
	try {
		await fetch(apiUrl + "/logout", {
			method: "POST",
			//			credentials: "include", // Clear HTTP-only cookies
		});

		setUser(null); // Clear user context
		localStorage.removeItem("accessToken"); // Optional: Clear any stored tokens
	} catch (error) {
		console.error("Failed to log out:", error);
		throw error;
	}
};

export const refreshToken = async () => {
	try {
		const refreshToken = localStorage.getItem("refreshToken"); // Get refresh token from storage
		if (!refreshToken) {
			throw new Error("No refresh token found.");
		}

		const response = await fetch(apiUrl + "/user/refresh-token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }), // Send refreshToken in the request body
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token.");
		}

		const data = await response.json();
		console.log(data)
		localStorage.setItem("accessToken", data.accessToken); // Update access token
		return data.accessToken;
	} catch (error) {
		console.error("Error refreshing token:", error);
		throw error;
	}
};


export const signup = async (
	username: string,
	email: string,
	password: string,
	setUser: (user: User | null) => void
) => {
	try {
		const response = await fetch(URL + "/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to sign up. Please check your information.");
		}

		const data = await response.json();
		console.log("Signup successful:", data);

		// Update user in context
		setUser({ id: data.id }); // Set the user based on the response, assuming `data.id` is the unique identifier

		// Optionally store an access token and userId for session restoration
		localStorage.setItem("accessToken", data.accessToken);
		localStorage.setItem("userId", data.id);
		localStorage.setItem("refreshToken", data.refreshToken);

		return data;
	} catch (error: any) {
		console.error("Signup error:", error.message || error);
		throw error;
	}
};

export const logout = (setUser: Function) => {
	setUser(() => ({ id: "-1" }));
	localStorage.removeItem("user")
	localStorage.removeItem("jwt")
	localStorage.removeItem("userEmail")
	localStorage.removeItem("userId")
}
