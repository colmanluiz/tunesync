import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth/spotify')
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly prisma: PrismaService,
  ) { }

  @Get('login')
  async login(@Res() res: Response) {
    const authUrl = await this.spotifyService.getAuthUrl();

    res.redirect(authUrl);
  }

  @Get('callback')
  @UseGuards(JwtAuthGuard)
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (error) {
        throw new Error(`Spotify authorization failed: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Extract userId from JWT
      // req.user is set by JwtAuthGuard
      const user = req.user as any;
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const result = await this.spotifyService.handleCallback(
        code,
        user.userId,
      );

      // Generate a new JWT with the Spotify access token
      const newJwtToken = await this.spotifyService.generateJwtWithSpotifyToken(
        user.userId,
      );

      // TO:DO Redirect to a success page
      res.json({
        message: 'Spotify connection successful!',
        profile: result.profile,
        token: newJwtToken, // Updated JWT with Spotify token
      });
    } catch (error) {
      // TO:DO Redirect to an error page
      res.status(400).json({
        message: 'Failed to connect Spotify',
        error: error.message,
      });
    }
  }

  @Get('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req: Request) {
    try {
      const user = req.user as any;
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const newToken = await this.spotifyService.generateJwtWithSpotifyToken(
        user.userId,
      );

      return {
        message: 'Token refreshed successfully',
        token: newToken,
      };
    } catch (error) {
      return {
        message: 'Failed to refresh token',
        error: error.message,
      };
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getConnectionStatus(@Req() req: Request) {
    try {
      const user = req.user as any;
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const connection = await this.prisma.serviceConnection.findUnique({
        where: {
          userId_serviceType: {
            userId: user.userId,
            serviceType: 'SPOTIFY',
          },
        },
      });

      return {
        connected: !!connection,
        hasValidToken: connection && connection.expiresAt ? new Date(connection.expiresAt) > new Date() : false,
        serviceUserId: connection?.serviceUserId,
      };
    } catch (error) {
      return {
        connected: false,
        hasValidToken: false,
        error: error.message,
      };
    }
  }
}
