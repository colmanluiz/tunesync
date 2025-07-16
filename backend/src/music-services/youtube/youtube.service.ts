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
  SearchResults,
} from '../interfaces/music-service.interface';
import { BaseMusicService } from '../base-music.service';

@Injectable()
export class YouTubeService extends BaseMusicService {
  readonly serviceType: ServiceType = 'YOUTUBE';
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
  ) {
    const clientId = config.get<string>('YOUTUBE_CLIENT_ID');
    const clientSecret = config.get<string>('YOUTUBE_CLIENT_SECRET');
    const redirectUri = config.get<string>('YOUTUBE_REDIRECT_URI');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required YouTube configuration');
    }

    super(prisma, config, httpService, {
      clientId,
      clientSecret,
      redirectUri,
      scopes: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
      ],
    });
  }

  getAuthUrl(state: string): string {
    const params = {
      response_type: 'code',
      client_id: this.serviceConfig.clientId,
      redirect_uri: this.serviceConfig.redirectUri,
      scope: this.serviceConfig.scopes.join(' '),
      state,
      access_type: 'offline',
      prompt: 'consent',
    };

    return `https://accounts.google.com/o/oauth2/v2/auth?${queryString.stringify(params)}`;
  }

  async handleCallback(
    code: string,
    userId: string,
  ): Promise<{
    success: boolean;
    profile: ServiceProfile;
    message: string;
  }> {
    try {
      // Exchange code for tokens
      const tokenResponse = await firstValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', {
          client_id: this.serviceConfig.clientId,
          client_secret: this.serviceConfig.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.serviceConfig.redirectUri,
        }),
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Get user profile
      const profile = await this.getUserProfile(access_token);

      // Store connection in database
      await this.prisma.serviceConnection.upsert({
        where: {
          userId_serviceType: {
            userId,
            serviceType: this.serviceType,
          },
        },
        update: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: new Date(Date.now() + expires_in * 1000),
          serviceUserId: profile.id,
        },
        create: {
          userId,
          serviceType: this.serviceType,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: new Date(Date.now() + expires_in * 1000),
          serviceUserId: profile.id,
        },
      });

      return {
        success: true,
        profile,
        message: 'YouTube connected successfully',
      };
    } catch (error) {
      console.error('YouTube OAuth error:', error);
      return {
        success: false,
        profile: { id: '', name: '', email: undefined, imageUrl: undefined },
        message: 'Failed to connect YouTube',
      };
    }
  }

  async getUserProfile(accessToken: string): Promise<ServiceProfile> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/channels`, {
          params: {
            part: 'snippet',
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const channel = response.data.items?.[0];
      if (!channel) {
        throw new Error('No channel found for user');
      }

      return {
        id: channel.id,
        name: channel.snippet.title,
        email: undefined, // YouTube API doesn't provide email in channel data
        imageUrl: channel.snippet.thumbnails?.default?.url,
      };
    } catch (error) {
      console.error('Failed to get YouTube user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  protected async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', {
          client_id: this.serviceConfig.clientId,
          client_secret: this.serviceConfig.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error('Failed to refresh YouTube token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  async getPlaylists(
    userId: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    data: {
      total: number;
      playlists: ServicePlaylist[];
      nextPage?: string;
    };
  }> {
    try {
      const token = accessToken || (await this.getValidAccessToken(userId));

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/playlists`, {
          params: {
            part: 'snippet,contentDetails,status',
            mine: true,
            maxResults: 50,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const playlists: ServicePlaylist[] = response.data.items.map(
        (item: any) => ({
          id: item.id,
          name: item.snippet.title,
          description: item.snippet.description || '',
          trackCount: item.contentDetails.itemCount || 0,
          public: item.status.privacyStatus === 'public',
          collaborative: false, // YouTube doesn't have collaborative playlists like Spotify
          ownerId: item.snippet.channelId,
          imageUrl: item.snippet.thumbnails?.default?.url,
        }),
      );

      return {
        success: true,
        data: {
          total: response.data.pageInfo.totalResults || playlists.length,
          playlists,
          nextPage: response.data.nextPageToken,
        },
      };
    } catch (error) {
      console.error('Failed to get YouTube playlists:', error);
      return {
        success: false,
        data: {
          total: 0,
          playlists: [],
        },
      };
    }
  }

  async getPlaylistDetails(
    userId: string,
    playlistId: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }> {
    try {
      const token = accessToken || (await this.getValidAccessToken(userId));

      // Get playlist info
      const playlistResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/playlists`, {
          params: {
            part: 'snippet,contentDetails,status',
            id: playlistId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const playlistData = playlistResponse.data.items?.[0];
      if (!playlistData) {
        throw new Error('Playlist not found');
      }

      // Get playlist items
      const itemsResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/playlistItems`, {
          params: {
            part: 'snippet,contentDetails',
            playlistId,
            maxResults: 50,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const tracks: ServiceTrack[] = itemsResponse.data.items
        .filter((item: any) => item.snippet.resourceId.kind === 'youtube#video')
        .map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          name: item.snippet.title,
          artist: item.snippet.videoOwnerChannelTitle || 'Unknown Artist',
          album: undefined,
          duration: undefined, // Would need additional API call to get duration
          imageUrl: item.snippet.thumbnails?.default?.url,
          previewUrl: undefined,
          externalUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        }));

      const playlist: ServicePlaylist & { tracks: ServiceTrack[] } = {
        id: playlistData.id,
        name: playlistData.snippet.title,
        description: playlistData.snippet.description || '',
        trackCount: tracks.length,
        public: playlistData.status.privacyStatus === 'public',
        collaborative: false,
        ownerId: playlistData.snippet.channelId,
        imageUrl: playlistData.snippet.thumbnails?.default?.url,
        tracks,
      };

      return {
        success: true,
        playlist,
      };
    } catch (error) {
      console.error('Failed to get YouTube playlist details:', error);
      throw new Error('Failed to get playlist details');
    }
  }

  async createPlaylist(
    userId: string,
    name: string,
    description?: string,
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist;
  }> {
    try {
      const token = accessToken || (await this.getValidAccessToken(userId));

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/playlists`,
          {
            snippet: {
              title: name,
              description: description || '',
            },
            status: {
              privacyStatus: 'private',
            },
          },
          {
            params: {
              part: 'snippet,status',
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const playlistData = response.data;
      const playlist: ServicePlaylist = {
        id: playlistData.id,
        name: playlistData.snippet.title,
        description: playlistData.snippet.description || '',
        trackCount: 0,
        public: playlistData.status.privacyStatus === 'public',
        collaborative: false,
        ownerId: playlistData.snippet.channelId,
        imageUrl: playlistData.snippet.thumbnails?.default?.url,
      };

      return {
        success: true,
        playlist,
      };
    } catch (error) {
      console.error('Failed to create YouTube playlist:', error);
      return {
        success: false,
        playlist: {
          id: '',
          name: '',
          description: '',
          trackCount: 0,
          public: false,
          collaborative: false,
          ownerId: '',
          imageUrl: undefined,
        },
      };
    }
  }

  async addTracksToPlaylist(
    userId: string,
    playlistId: string,
    trackIds: string[],
    accessToken?: string,
  ): Promise<{
    success: boolean;
    playlist: ServicePlaylist & { tracks: ServiceTrack[] };
  }> {
    try {
      const token = accessToken || (await this.getValidAccessToken(userId));

      // Add tracks to playlist
      for (const trackId of trackIds) {
        await firstValueFrom(
          this.httpService.post(
            `${this.baseUrl}/playlistItems`,
            {
              snippet: {
                playlistId,
                resourceId: {
                  kind: 'youtube#video',
                  videoId: trackId,
                },
              },
            },
            {
              params: {
                part: 'snippet',
              },
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
      }

      // Return updated playlist details
      const result = await this.getPlaylistDetails(userId, playlistId, token);
      return result;
    } catch (error) {
      console.error('Failed to add tracks to YouTube playlist:', error);
      throw new Error('Failed to add tracks to playlist');
    }
  }

  async search(
    query: string,
    type: ('track' | 'playlist')[],
    accessToken: string,
    page?: string,
  ): Promise<SearchResults> {
    try {
      const searchTypes: string[] = [];
      if (type.includes('track')) searchTypes.push('video');
      if (type.includes('playlist')) searchTypes.push('playlist');

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search`, {
          params: {
            part: 'snippet',
            q: query,
            type: searchTypes.join(','),
            maxResults: 25,
            pageToken: page,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const tracks: ServiceTrack[] = [];
      const playlists: ServicePlaylist[] = [];

      response.data.items.forEach((item: any) => {
        if (item.id.kind === 'youtube#video') {
          tracks.push({
            id: item.id.videoId,
            name: item.snippet.title,
            artist: item.snippet.channelTitle,
            album: undefined,
            duration: undefined,
            imageUrl: item.snippet.thumbnails?.default?.url,
            previewUrl: undefined,
            externalUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          });
        } else if (item.id.kind === 'youtube#playlist') {
          playlists.push({
            id: item.id.playlistId,
            name: item.snippet.title,
            description: item.snippet.description || '',
            trackCount: 0, // Would need additional API call
            public: true, // Assume public if found in search
            collaborative: false,
            ownerId: item.snippet.channelId,
            imageUrl: item.snippet.thumbnails?.default?.url,
          });
        }
      });

      return {
        tracks,
        playlists: type.includes('playlist') ? playlists : undefined,
        nextPage: response.data.nextPageToken,
        total:
          response.data.pageInfo.totalResults ||
          tracks.length + playlists.length,
      };
    } catch (error) {
      console.error('Failed to search YouTube:', error);
      return {
        tracks: [],
        playlists: [],
        total: 0,
      };
    }
  }

  async getRecommendations(
    seedTracks: string[],
    accessToken: string,
    limit?: number,
  ): Promise<ServiceTrack[]> {
    try {
      // YouTube doesn't have a direct recommendations API like Spotify
      // We'll search for related content based on the first seed track
      if (seedTracks.length === 0) {
        return [];
      }

      // Get details of the first seed track to use for related search
      const videoResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/videos`, {
          params: {
            part: 'snippet',
            id: seedTracks[0],
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const video = videoResponse.data.items?.[0];
      if (!video) {
        return [];
      }

      // Search for related content using the video's title and channel
      const searchQuery = `${video.snippet.title} ${video.snippet.channelTitle}`;
      const searchResult = await this.search(
        searchQuery,
        ['track'],
        accessToken,
      );

      // Filter out the original tracks and return limited results
      const recommendations = searchResult.tracks
        .filter((track) => !seedTracks.includes(track.id))
        .slice(0, limit || 20);

      return recommendations;
    } catch (error) {
      console.error('Failed to get YouTube recommendations:', error);
      return [];
    }
  }
}
