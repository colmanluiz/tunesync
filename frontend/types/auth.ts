import { User, ServiceConnection } from './services';

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
  refreshUser: () => Promise<void>;
}