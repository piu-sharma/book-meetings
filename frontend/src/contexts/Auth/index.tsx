import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginUser, getToken, logoutUser } from "@/services/loginService";

interface AuthContextProps {
	isAuthenticated: boolean;
	role: string | null;
	userName: string | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	userName: null,
	role: null,
	login: async () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
	const [role, setRole] = useState<string | null>(null);
	const [userName, setUserName] = useState<string | null>(null);

	useEffect(() => {
		setIsAuthenticated(!!getToken());
	}, []);

	const login = async (username: string, password: string) => {
		const { role } = await loginUser(username, password);
		setRole(role);
		setUserName(username);
		setIsAuthenticated(true);
	};

	const logout = () => {
		logoutUser();
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, role, login, logout, userName }}
		>
			{children}
		</AuthContext.Provider>
	);
};
