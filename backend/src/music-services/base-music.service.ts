import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  IMusicService,
  MusicServiceConfig,
  ServiceType,
  ServiceProfile,
  ServicePlaylist,
  ServiceTrack,
} from './interfaces/music-service.interface';

@Injectable()
export abstract class BaseMusicService implements IMusicService {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly serviceConfig: MusicServiceConfig,
  ) {}

  abstract readonly serviceType: ServiceType;

  // Authentication
  abstract getAuthUrl(state: string): string;
  abstract handleCallback(
    code: string,
    userId: string,
  ): Promise<{
    success: boolean;
    profile: ServiceProfile;
    message: string;
  }>;
  abstract getUserProfile(accessToken: string): Promise<ServiceProfile>;

  /**
   * Get a valid access token for a user, refreshing if necessary
   */
  async getValidAccessToken(userId: string): Promise<string> {
    const connection = await this.prisma.serviceConnection.findUnique({
      where: {
        userId_serviceType: {
          userId,
          serviceType: this.serviceType,
        },
      },
    });

    if (!connection) {
      throw new Error(`${this.serviceType} connection not found`);
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    if (!connection.expiresAt) {
      throw new Error(`${this.serviceType} token expiration not set`);
    }

    const expiresAt = new Date(connection.expiresAt);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (expiresAt <= fiveMinutesFromNow) {
      // Token is expired or will expire soon, refresh it
      if (!connection.refreshToken) {
        throw new Error('No refresh token available');
      }

      const newTokens = await this.refreshAccessToken(connection.refreshToken);

      // Update the connection with new tokens
      await this.prisma.serviceConnection.update({
        where: {
          userId_serviceType: {
            userId,
            serviceType: this.serviceType,
          },
        },
        data: {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken || connection.refreshToken,
          expiresAt: new Date(Date.now() + newTokens.expiresIn * 1000),
        },
      });

      return newTokens.accessToken;
    }

    return connection.accessToken;
  }

  /**
   * Disconnect a user from the music service
   */
  async disconnect(userId: string): Promise<void> {
    await this.prisma.serviceConnection.delete({
      where: {
        userId_serviceType: {
          userId,
          serviceType: this.serviceType,
        },
      },
    });
  }

  // Abstract methods that must be implemented by specific services
  protected abstract refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }>;

  abstract getPlaylists(
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

  abstract getPlaylistDetails(
    userId: string,
    playlistId: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }>;

  abstract createPlaylist(
    userId: string,
    name: string,
    description?: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist;
  }>;

  abstract addTracksToPlaylist(
    userId: string,
    playlistId: string,
    trackIds: string[],
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }>;

  abstract search(
    query: string,
    type: ('track' | 'playlist')[],
    accessToken: string,
    page?: string,
  ): Promise<{
    tracks: ServiceTrack[];
    playlists?: ServicePlaylist[];
    nextPage?: string;
    total: number;
  }>;

  abstract getRecommendations(
    seedTracks: string[],
    accessToken: string,
    limit?: number,
  ): Promise<ServiceTrack[]>;
}
