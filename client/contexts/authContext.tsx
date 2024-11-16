"use client";

import { AuthContextType, User } from "@/utils/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({
	user: { username: "Guest", email: undefined },
	setUser: () => { },
});

export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>({
		id:0,
	});

	useEffect(() => {
		const userId = localStorage.getItem("userId");

		if (user) {
			setUser(JSON.parse(userId));
		}
	}, []);

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
