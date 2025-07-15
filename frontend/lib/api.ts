import axios, { AxiosError } from "axios";
import { AuthStorage, AuthError } from "./auth";
import { User } from "@/types/services";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001",
});

api.interceptors.request.use((config) => {
  const token = AuthStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Network errors
    if (!error.response) {
      throw new AuthError("Network error occurred", "network_error", error);
    }

    // Auth errors
    if (error.response.status === 401) {
      // Clear auth data
      AuthStorage.clearStoredAuth();

      throw new AuthError("Authentication failed", "token_expired", error);
    }

    return Promise.reject(error);
  }
);

export default api;

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AuthError(
          error.response?.data?.message || "Login failed",
          "unknown",
          error
        );
      }
      throw error;
    }
  },

  register: async (
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>("/auth/register", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AuthError(
          error.response?.data?.message || "Registration failed",
          "unknown",
          error
        );
      }
      throw error;
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },
};
