
"use client";

import { AuthContextType, User } from "@/utils/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>({
		id: "-1",
		username: null,
	});
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		const userId = localStorage.getItem("userId");
		const username = localStorage.getItem("username");

		if (userId && username) {
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
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuthContext must be used within an AuthContextWrapper");
	}

	return context;
}
