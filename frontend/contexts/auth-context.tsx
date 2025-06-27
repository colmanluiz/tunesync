"use client";

import { User, StoredAuthData, AuthContextType } from "@/types/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToStorage = (data: StoredAuthData) => {
    try {
      localStorage.setItem("authData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  };

  const loadFromStorage = (): StoredAuthData | null => {
    try {
      const data = localStorage.getItem("authData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load auth data:", error);
      return null;
    }
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem("authData");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  };

  useEffect(() => {
    const storedData = loadFromStorage();

    if (storedData) {
      setUser(storedData.user);
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    setUser(user);
    saveToStorage({ token, user });
  };

  const logout = () => {
    setUser(null);
    clearStorage();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
