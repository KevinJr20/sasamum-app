import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null; 
  login: (token: string, userData?: User, refreshToken?: string) => void;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'mother' | 'provider' | 'chw';
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("sasa_token");
    } catch (e) {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      try {
        localStorage.setItem("sasa_token", token);
      } catch (e) {}
    } else {
      setAuthToken(null);
      try {
        localStorage.removeItem("sasa_token");
      } catch (e) {}
    }
  }, [token]);

  const login = (newToken: string, userData?: any, refreshToken?: string) => {
    setToken(newToken);
    if (userData) setUser(userData);
    try {
      if (refreshToken) localStorage.setItem("sasa_refresh", refreshToken);
    } catch (e) {}
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("sasa_token");
      localStorage.removeItem("sasa_refresh");
    } catch (e) {}
    api.post("/auth/logout").catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
