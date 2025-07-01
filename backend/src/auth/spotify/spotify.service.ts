import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import queryString from 'query-string';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '../jwt.service';

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
    private readonly jwtService: JwtService,
  ) {}

  async getAuthUrl(state?: string): Promise<string> {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const redirectURI = this.config.get<string>('SPOTIFY_REDIRECT_URI');

    const params: any = {
      response_type: 'code',
      client_id: clientId,
      scope: this.scopes.join(' '),
      redirect_uri: redirectURI,
    };

    if (state) {
      params.state = state;
    }

    const authUrl =
      'https://accounts.spotify.com/authorize?' + queryString.stringify(params);

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
   * @returns The user's profile and connection status
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

      return {
        success: true,
        profile,
        message: 'Spotify connected successfully',
      };
    } catch (error) {
      throw new Error(`Failed to handle Spotify callback: ${error.message}`);
    }
  }

  private async refreshSpotifyToken(refreshToken: string) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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

      return data;
    } catch (error) {
      throw new Error(`Failed to refresh Spotify token: ${error.message}`);
    }
  }

  /**
   * Get a valid Spotify access token for a user, refreshing if necessary
   */
  async getValidAccessToken(userId: string): Promise<string> {
    const connection = await this.prisma.serviceConnection.findUnique({
      where: {
        userId_serviceType: {
          userId,
          serviceType: 'SPOTIFY',
        },
      },
    });

    if (!connection) {
      throw new Error('Spotify connection not found');
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    if (!connection.expiresAt) {
      throw new Error('Spotify token expiration not set');
    }

    const expiresAt = new Date(connection.expiresAt);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (expiresAt <= fiveMinutesFromNow) {
      // Token is expired or will expire soon, refresh it
      if (!connection.refreshToken) {
        throw new Error('No refresh token available');
      }

      const newTokens = await this.refreshSpotifyToken(connection.refreshToken);

      // Update the connection with new tokens
      await this.prisma.serviceConnection.update({
        where: {
          userId_serviceType: {
            userId,
            serviceType: 'SPOTIFY',
          },
        },
        data: {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || connection.refreshToken, // Spotify might not return refresh_token
          expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
        },
      });

      return newTokens.access_token;
    }

    return connection.accessToken;
  }

  /**
   * Generate a new JWT token with the current Spotify access token
   */
  async generateJwtWithSpotifyToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get a valid Spotify access token
    const spotifyAccessToken = await this.getValidAccessToken(userId);

    return this.jwtService.generateToken({
      sub: userId,
      email: user.email,
      spotifyAccessToken,
    });
  }
}
