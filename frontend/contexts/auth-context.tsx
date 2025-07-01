"use client";

import { StoredAuthData, AuthContextType } from "@/types/auth";
import { User } from "@/types/services";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToStorage = (data: StoredAuthData) => {
    try {
      localStorage.setItem("authData", JSON.stringify(data));
      // Also store token separately for API client
      localStorage.setItem("token", data.token);
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
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Set token temporarily for validation request
      localStorage.setItem("token", token);
      await api.get("/auth/me");
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.user) {
        setUser(response.data.user);
        // Update stored user data
        const storedData = loadFromStorage();
        if (storedData) {
          saveToStorage({ ...storedData, user: response.data.user });
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, logout user
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedData = loadFromStorage();

      if (storedData?.token) {
        // Validate token on app startup
        const isValid = await validateToken(storedData.token);

        if (isValid) {
          setUser(storedData.user);
        } else {
          // Token is invalid, clear storage
          clearStorage();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
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
    refreshUser,
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
