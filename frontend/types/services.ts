export type ServiceType =
  | "SPOTIFY"
  | "YOUTUBE"
  | "APPLE-MUSIC"
  | "AMAZON-MUSIC"
  | "DEEZER"
  | "SOUNDCLOUD"
  | "TIDAL";

export interface ServiceConnection {
  id: string;
  userId: string;
  serviceType: ServiceType;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  serviceUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  serviceConnections: ServiceConnection[];
}
