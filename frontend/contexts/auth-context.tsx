"use client";

import { AuthContextType, AuthState } from "@/types/auth";
import { User } from "@/types/services";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { auth } from "@/lib/api";
import { AuthStorage } from "@/lib/auth";

type AuthAction =
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_USER"; payload: { user: User | null } }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, status: "loading", error: null };
    case "SET_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        status: action.payload.user ? "authenticated" : "idle",
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_LOADING" });

      try {
        const storedAuth = AuthStorage.getStoredAuth();
        if (!storedAuth?.token) {
          dispatch({ type: "SET_USER", payload: { user: null } });
          return;
        }

        const isValid = await auth.validateToken(storedAuth.token);
        if (!isValid) {
          AuthStorage.clearStoredAuth();
          dispatch({ type: "SET_USER", payload: { user: null } });
          return;
        }

        const user = await auth.getCurrentUser();
        dispatch({ type: "SET_USER", payload: { user } });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to initialize auth" });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING" });

    try {
      const { token, user } = await auth.login(email, password);
      AuthStorage.setStoredAuth({ token, user });
      dispatch({ type: "SET_USER", payload: { user } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Login failed" });
      throw error;
    }
  };

  const loginWithToken = async (token: string, user: User) => {
    dispatch({ type: "SET_LOADING" });
    try {
      AuthStorage.setStoredAuth({ token, user });
      dispatch({ type: "SET_USER", payload: { user } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Login failed" });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING" });

    try {
      const { token, user } = await auth.register(email, password);
      AuthStorage.setStoredAuth({ token, user });
      dispatch({ type: "SET_USER", payload: { user } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Registration failed" });
      throw error;
    }
  };

  const logout = () => {
    AuthStorage.clearStoredAuth();
    dispatch({ type: "SET_USER", payload: { user: null } });
  };

  const refreshUser = async () => {
    dispatch({ type: "SET_LOADING" });

    try {
      const user = await auth.getCurrentUser();
      dispatch({ type: "SET_USER", payload: { user } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to refresh user" });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginWithToken,
    register,
    logout,
    refreshUser,
    isAuthenticated: state.status === "authenticated",
    isLoading: state.status === "loading",
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
