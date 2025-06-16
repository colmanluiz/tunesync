import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import queryString from 'query-string';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyService {
  private readonly scopes = [
    'user-read-email', // Read user's email
    'user-read-private', // Read user's private information
    'playlist-read-private', // Read private playlists
    'playlist-read-collaborative', // Read collaborative playlists
    'playlist-modify-public', // Create/modify public playlists
    'playlist-modify-private', // Create/modify private playlists
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getAuthUrl(): Promise<string> {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const redirectURI = this.config.get<string>('SPOTIFY_REDIRECT_URI');

    const authUrl =
      'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: this.scopes,
        redirect_uri: redirectURI,
      });

    return authUrl;
  }

  private async exchangeCodeForTokens(code: string) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
    const redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI');

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://accounts.spotify.com/api/token`,
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
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

  private async getUserProfile(accessToken: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return data;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * @param code - The authorization code from Spotify
   * @param userId - The ID of the user in our system
   * @returns The user's profile and success status
   */
  async handleCallback(code: string, userId: string) {
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      const profile = await this.getUserProfile(tokens.access_token);

      await this.prisma.serviceConnection.upsert({
        where: {
          userId_serviceType: {
            userId,
            serviceType: 'SPOTIFY',
          },
        },
        create: {
          userId,
          serviceType: 'SPOTIFY',
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

      return { success: true, profile };
    } catch (error) {
      throw new Error(`Failed to handle Spotify callback: ${error.message}`);
    }
  }
}
