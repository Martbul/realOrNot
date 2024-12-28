import { User } from "@/utils/interfaces";

const URL = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;
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

export const refreshToken = async () => {
	try {
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) {
			throw new Error("No refresh token found.");
		}

		const response = await fetch(URL + "/user/refresh-token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token.");
		}

		const data = await response.json();
		console.log(data)
		localStorage.setItem("accessToken", data.accessToken);
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
		const response = await fetch(URL + "/user/signup", {
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

		setUser({ id: data.id, username: data.username });

		localStorage.setItem("username", data.username);
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
