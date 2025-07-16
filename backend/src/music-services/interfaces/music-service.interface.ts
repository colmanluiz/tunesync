import { ServiceConnection, Track, Playlist, User } from '@prisma/client';

export type ServiceType = 'SPOTIFY' | 'YOUTUBE' | 'APPLE-MUSIC' | 'DEEZER';

export interface MusicServiceConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface ServiceProfile {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string;
}

export interface ServicePlaylist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  public: boolean;
  collaborative: boolean;
  ownerId: string;
  imageUrl?: string;
}

export interface ServiceTrack {
  id: string;
  name: string;
  artist: string;
  album?: string;
  duration?: number; // in milliseconds
  imageUrl?: string;
  previewUrl?: string;
  externalUrl?: string;
}

export interface SearchResults {
  tracks: ServiceTrack[];
  playlists?: ServicePlaylist[];
  nextPage?: string;
  total: number;
}

export interface IMusicService {
  readonly serviceType: ServiceType;

  // Authentication
  getAuthUrl(state: string): string;
  handleCallback(
    code: string,
    userId: string,
  ): Promise<{
    success: boolean;
    profile: ServiceProfile;
    message: string;
  }>;
  disconnect(userId: string): Promise<void>;
  getValidAccessToken(userId: string): Promise<string>;

  // Profile
  getUserProfile(accessToken: string): Promise<ServiceProfile>;

  // Playlists
  getPlaylists(
    userId: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    data: {
      total: number;
      playlists: ServicePlaylist[];
      nextPage?: string;
    };
  }>;

  getPlaylistDetails(
    userId: string,
    playlistId: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }>;

  createPlaylist(
    userId: string,
    name: string,
    description?: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist;
  }>;

  addTracksToPlaylist(
    userId: string,
    playlistId: string,
    trackIds: string[],
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }>;

  // Search
  search(
    query: string,
    type: ('track' | 'playlist')[],
    accessToken: string,
    page?: string,
  ): Promise<SearchResults>;

  // Recommendations
  getRecommendations(
    seedTracks: string[],
    accessToken: string,
    limit?: number,
  ): Promise<ServiceTrack[]>;
}
