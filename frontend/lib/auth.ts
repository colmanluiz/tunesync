import { User } from "@/types/services";
import { StoredAuthData } from "@/types/auth";

const AUTH_STORAGE_KEY = "authData" as const;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

export class AuthStorage {
  static getStoredAuth(): StoredAuthData | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load auth data:", error);
      return null;
    }
  }

  static setStoredAuth(data: StoredAuthData): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  }

  static clearStoredAuth(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime - TOKEN_EXPIRY_BUFFER;
    } catch {
      return true;
    }
  }

  static getToken(): string | null {
    const data = this.getStoredAuth();
    if (!data?.token || this.isTokenExpired(data.token)) {
      return null;
    }
    return data.token;
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code:
      | "token_expired"
      | "invalid_token"
      | "network_error"
      | "unknown",
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}
