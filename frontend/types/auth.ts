import { User } from "./services";

export interface StoredAuthData {
  token: string;
  user: User;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string, user: User) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
