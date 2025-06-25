"use client";

import { AuthUser, SpotifyProfile, StoredAuthData } from "@/types/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  // Data
  user: AuthUser | null;
  profile: SpotifyProfile | null;
  isLoading: boolean;

  // Actions
  login: (token: string, profile: SpotifyProfile) => void;
  logout: () => void;

  // Computed
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setProfile(storedData.profile);
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, profile: SpotifyProfile) => {
    // Create user object from JWT token
    // In a real app, you'd decode the JWT to get user info
    // For now, we'll use the profile data
    const user: AuthUser = {
      userId: profile.id, // This should come from JWT in real app
      email: profile.email,
      spotifyAccessToken: token, // This should be the actual access token
    };

    // Update state
    setUser(user);
    setProfile(profile);

    // Save to localStorage
    saveToStorage({ token, user, profile });
  };

  const logout = () => {
    setUser(null);
    setProfile(null);

    clearStorage();
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user, // Convert to boolean
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
