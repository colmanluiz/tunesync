export interface AuthUser {
  userId: string;
  email: string;
  spotifyAccessToken: string;
}

export interface SpotifyProfile {
  id: string;
  email: string;
  display_name: string;
  images?: Array<{ url: string; height?: number; width: number; }>
  country?: string;
  product?: string;
  type?: string;
  uri?: string
}

export interface StoredAuthData {
  token: string;
  user: AuthUser;
  profile: SpotifyProfile
}