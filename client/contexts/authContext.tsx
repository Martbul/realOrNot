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
		username: null
	});
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		const userId = localStorage.getItem("userId");
		const username = localStorage.getItem("username");
		console.log(userId)
		if (userId) {
			setUser({ id: userId, username: username });
		}
	}, []);

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
