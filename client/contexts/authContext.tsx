
"use client";

import { AuthContextType, User } from "@/utils/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({
	user: { id: "-1" },
	setUser: () => { },
});

export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>({
		id: "-1",
	});
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// This ensures the code only runs in the browser
		setIsMounted(true);

		// Retrieve user data from localStorage
		const userId = localStorage.getItem("userId");
		if (userId) {
			setUser(JSON.parse(userId));
		}
	}, []);

	// Prevent rendering the AuthContext until the component is mounted (client-side)
	if (!isMounted) {
		return null;
	}

	const contextValue: AuthContextType = {
		user,
		setUser,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
