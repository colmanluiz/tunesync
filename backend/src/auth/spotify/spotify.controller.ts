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
  ) {}

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

      // TO:DO Redirect to a success page
      res.json({
        message: 'Spotify connection successful!',
        profile: result.profile,
        token: result.token,
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
