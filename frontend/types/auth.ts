export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface StoredAuthData {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}