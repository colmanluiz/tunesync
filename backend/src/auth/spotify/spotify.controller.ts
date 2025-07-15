import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StateService } from 'src/state/state.service';

@Controller('auth/spotify')
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly prisma: PrismaService,
    private readonly stateService: StateService,
  ) {}

  @Post('state')
  @UseGuards(JwtAuthGuard)
  async getState(@Req() req: Request) {
    const user = req.user as any;
    if (!user || !user.userId) {
      throw new Error('User not authenticated');
    }

    const state = await this.stateService.createState(user.userId);

    return {
      state: state,
    };
  }

  @Get('login')
  async login(@Query('state') state: string, @Res() res: Response) {
    const authUrl = await this.spotifyService.getAuthUrl(state);

    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      if (error) {
        throw new Error(`Spotify authorization failed: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      if (!state) {
        throw new Error('No state received');
      }

      const userId = await this.stateService.popUserIdByState(state);
      if (!userId) {
        throw new Error('Invalid state or state expired');
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const result = await this.spotifyService.handleCallback(code, user.id);

      // Generate a new JWT with the Spotify access token
      const newJwtToken = await this.spotifyService.generateJwtWithSpotifyToken(
        user.id,
      );

      // res.json({
      //   message: 'Spotify connection successful!',
      //   profile: result.profile,
      //   token: newJwtToken, // Updated JWT with Spotify token
      // });

      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <script>
              // Send a message to the opener window
              window.opener.postMessage(
                {
                  type: "SPOTIFY_AUTH_SUCCESS",
                  token: "${newJwtToken}"
                },
                "*"
              );
              window.close();
            </script>
            <p>Spotify authentication successful. You can close this window.</p>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);

      // res.redirect(`${process.env.FRONTEND_URL}/spotify/success?token=${newJwtToken}`);
    } catch (error) {
      // TO:DO Redirect to an error page
      res.status(400).json({
        message: 'Failed to connect Spotify',
        error: error.message,
      });

      // res.redirect(`${process.env.FRONTEND_URL}/spotify/error?error=${error.message}&state=${state}`);
    }
  }

  @Post('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnect(@Req() req: Request) {
    const user = req.user as any;
    if (!user || !user.userId) {
      throw new Error('User not authenticated');
    }

    await this.spotifyService.disconnect(user.userId);

    return {
      message: 'Spotify disconnected successfully',
    };
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
        hasValidToken:
          connection && connection.expiresAt
            ? new Date(connection.expiresAt) > new Date()
            : false,
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
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

    if (!connection) {
      throw new Error('Spotify connection not found');
    }

    const profile = await this.spotifyService.getUserProfile(
      connection.accessToken,
    );

    return profile;
  }
}
