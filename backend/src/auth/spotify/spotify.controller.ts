import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth/spotify')
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    const authUrl = await this.spotifyService.getAuthUrl();

    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    try {
      if (error) {
        throw new Error(`Spotify authorization failed: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      const testUser = await this.prisma.user.upsert({
        where: { email: 'test@example.com' },
        create: {
          email: 'test@example.com',
          name: 'Test User',
        },
        update: {},
      });

      const result = await this.spotifyService.handleCallback(
        code,
        testUser.id,
      );

      // TO:DO Redirect to an success page
      res.json({
        message: 'Spotify connection successful!',
        profile: result.profile,
      });
    } catch (error) {
      // TO:DO Redirect to an error page
      res.status(400).json({
        message: 'Failed to connect Spotify',
        error: error.message,
      });
    }
  }
}
