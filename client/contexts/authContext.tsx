
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/utils/interfaces"; // Ensure User interface is correctly imported
import { refreshToken } from "@/services/auth/auth.service";

interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
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
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}


//"use client";

//import { AuthContextType, User } from "@/utils/interfaces";
//import React, { createContext, useContext, useEffect, useState } from "react";
//import { refreshToken } from "@/services/auth/auth.service";

//const AuthContext = createContext<AuthContextType>({
//	user: null,
//	setUser: () => { },
//});


//export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
//	const [user, setUser] = useState<User | null>(null);
//


//	useEffect(() => {
//		const checkSession = async () => {
//			try {
//				const accessToken = localStorage.getItem("accessToken");
//				if (!accessToken) {
//					const newAccessToken = await refreshToken();
//					localStorage.setItem("accessToken", newAccessToken);
//				}
//				const userId = JSON.parse(localStorage.getItem("userId") || "null");
//				console.log("User from localStorage:", userId);  // Add this line for debugging
//				if (userId) setUser({ id: userId });
//			} catch (error) {
//				console.error("Failed to restore session:", error);
//			}
//		};
//
//		checkSession();
//	}, []);

//	return (
//		<AuthContext.Provider value={{ user, setUser }}>
//			{children}
//		</AuthContext.Provider>
//	);
//}

//export function useAuthContext() {
//	return useContext(AuthContext);
//{{}}




//"use client";

//import { AuthContextType, User } from "@/utils/interfaces";
//import React, { createContext, useContext, useEffect, useState } from "react";

//const AuthContext = createContext<AuthContextType>({
//	user: { id: "-1" },
//	setUser: () => { },
//});

//export function AuthContextWrapper({ children }: { children: React.ReactNode }) {
//	const [user, setUser] = useState<User>({
//		id: "-1",
//	});

//	useEffect(() => {
//		let userId = localStorage.getItem("userId");
//		if (userId == null) {
//			userId = "-1"
//		}
//		if (user) {
//			setUser(JSON.parse(userId));
//		}
//	}, []);

//	const contextValue: AuthContextType = {
//		user,
//		setUser,
//	};

//	return (
//		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//	);
//}

//export function useAuthContext() {
//	return useContext(AuthContext);
//}
//
//
//
//
//
//
