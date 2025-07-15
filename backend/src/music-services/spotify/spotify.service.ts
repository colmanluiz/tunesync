import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import queryString from 'query-string';
import {
  ServiceType,
  ServiceProfile,
  ServicePlaylist,
  ServiceTrack,
  MusicServiceConfig,
} from '../interfaces/music-service.interface';
import { BaseMusicService } from '../base-music.service';

@Injectable()
export class SpotifyService extends BaseMusicService {
  readonly serviceType: ServiceType = 'SPOTIFY';

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
  ) {
    const clientId = config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = config.get<string>('SPOTIFY_CLIENT_SECRET');
    const redirectUri = config.get<string>('SPOTIFY_REDIRECT_URI');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required Spotify configuration');
    }

    super(prisma, config, httpService, {
      clientId,
      clientSecret,
      redirectUri,
      scopes: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
      ],
    });
  }

  getAuthUrl(state: string): string {
    const params = {
      response_type: 'code',
      client_id: this.serviceConfig.clientId,
      scope: this.serviceConfig.scopes.join(' '),
      redirect_uri: this.serviceConfig.redirectUri,
      state,
    };

    return (
      'https://accounts.spotify.com/authorize?' + queryString.stringify(params)
    );
  }

  async handleCallback(code: string, userId: string) {
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      const profile = await this.getUserProfile(tokens.access_token);

      await this.prisma.serviceConnection.upsert({
        where: {
          userId_serviceType: {
            userId,
            serviceType: this.serviceType,
          },
        },
        create: {
          userId,
          serviceType: this.serviceType,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          serviceUserId: profile.id,
        },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          serviceUserId: profile.id,
        },
      });

      return {
        success: true,
        profile: this.mapSpotifyProfile(profile),
        message: 'Spotify connected successfully',
      };
    } catch (error) {
      throw new Error(`Failed to handle Spotify callback: ${error.message}`);
    }
  }

  async getUserProfile(accessToken: string): Promise<ServiceProfile> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return this.mapSpotifyProfile(data);
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  private async exchangeCodeForTokens(code: string) {
    const auth = Buffer.from(
      `${this.serviceConfig.clientId}:${this.serviceConfig.clientSecret}`,
    ).toString('base64');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://accounts.spotify.com/api/token',
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.serviceConfig.redirectUri,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${auth}`,
            },
          },
        ),
      );

      return data;
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  protected async refreshAccessToken(refreshToken: string) {
    const auth = Buffer.from(
      `${this.serviceConfig.clientId}:${this.serviceConfig.clientSecret}`,
    ).toString('base64');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://accounts.spotify.com/api/token',
          {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${auth}`,
            },
          },
        ),
      );

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      throw new Error(`Failed to refresh Spotify token: ${error.message}`);
    }
  }

  async getPlaylists(userId: string, accessToken?: string) {
    try {
      const validAccessToken =
        accessToken || (await this.getValidAccessToken(userId));

      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${validAccessToken}`,
          },
          params: {
            limit: 50,
            offset: 0,
          },
        }),
      );

      const playlists = data.items.map((item: any) =>
        this.mapSpotifyPlaylist(item),
      );

      return {
        success: true,
        data: {
          total: data.total,
          playlists,
          nextPage: data.next,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch Spotify playlists: ${error.message}`);
    }
  }

  async getPlaylistDetails(
    userId: string,
    playlistId: string,
    accessToken?: string,
  ) {
    try {
      const validAccessToken =
        accessToken || (await this.getValidAccessToken(userId));

      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
            },
          },
        ),
      );

      return {
        success: true,
        playlist: {
          ...this.mapSpotifyPlaylist(data),
          tracks: data.tracks.items.map((item: any) =>
            this.mapSpotifyTrack(item.track),
          ),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch playlist details: ${error.message}`);
    }
  }

  async createPlaylist(
    userId: string,
    name: string,
    description?: string,
    accessToken?: string,
  ) {
    try {
      const validAccessToken =
        accessToken || (await this.getValidAccessToken(userId));

      const { data: profile } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${validAccessToken}`,
          },
        }),
      );

      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://api.spotify.com/v1/users/${profile.id}/playlists`,
          {
            name,
            description: description || '',
            public: false,
          },
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        success: true,
        playlist: this.mapSpotifyPlaylist(data),
      };
    } catch (error) {
      throw new Error(`Failed to create Spotify playlist: ${error.message}`);
    }
  }

  async addTracksToPlaylist(
    userId: string,
    playlistId: string,
    trackIds: string[],
    accessToken?: string,
  ) {
    try {
      const validAccessToken =
        accessToken || (await this.getValidAccessToken(userId));

      const trackUris = trackIds.map((id) => `spotify:track:${id}`);

      await firstValueFrom(
        this.httpService.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: trackUris,
          },
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // Get updated playlist details
      return this.getPlaylistDetails(userId, playlistId, validAccessToken);
    } catch (error) {
      throw new Error(
        `Failed to add tracks to Spotify playlist: ${error.message}`,
      );
    }
  }

  async search(
    query: string,
    type: ('track' | 'playlist')[],
    accessToken: string,
    page?: string,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/search', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: query,
            type: type.join(','),
            limit: 20,
            offset: page ? parseInt(page) : 0,
          },
        }),
      );

      return {
        tracks:
          data.tracks?.items.map((track: any) => this.mapSpotifyTrack(track)) ||
          [],
        playlists: data.playlists?.items.map((playlist: any) =>
          this.mapSpotifyPlaylist(playlist),
        ),
        nextPage: data.tracks?.next
          ? String(data.tracks.offset + data.tracks.limit)
          : undefined,
        total: data.tracks?.total || 0,
      };
    } catch (error) {
      throw new Error(`Failed to search Spotify: ${error.message}`);
    }
  }

  async getRecommendations(
    seedTracks: string[],
    accessToken: string,
    limit: number = 20,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            seed_tracks: seedTracks.join(','),
            limit,
          },
        }),
      );

      return data.tracks.map((track: any) => this.mapSpotifyTrack(track));
    } catch (error) {
      throw new Error(
        `Failed to get Spotify recommendations: ${error.message}`,
      );
    }
  }

  // Mapping functions
  private mapSpotifyProfile(profile: any): ServiceProfile {
    return {
      id: profile.id,
      name: profile.display_name,
      email: profile.email,
      imageUrl: profile.images?.[0]?.url,
    };
  }

  private mapSpotifyPlaylist(playlist: any): ServicePlaylist {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      trackCount: playlist.tracks.total,
      public: playlist.public,
      collaborative: playlist.collaborative,
      ownerId: playlist.owner.id,
      imageUrl: playlist.images?.[0]?.url,
    };
  }

  private mapSpotifyTrack(track: any): ServiceTrack {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album?.name,
      duration: track.duration_ms,
      imageUrl: track.album?.images?.[0]?.url,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls?.spotify,
    };
  }
}
