
// authService.js
export const login = async (email, password, setUser) => {
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
