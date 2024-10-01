import React, { createContext, useState, useEffect } from "react";
import { loginUser, getToken, logoutUser } from "@/services/loginService";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  const login = async (username: string, password: string) => {
    await loginUser(username, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};