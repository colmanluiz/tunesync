import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
  Param,
  Logger,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MusicServiceFactory } from './music-service.factory';
import { ServiceType } from './interfaces/music-service.interface';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    spotifyAccessToken?: string;
  };
}

@Controller('music-services')
@UseGuards(JwtAuthGuard)
export class MusicServicesController {
  private readonly logger = new Logger(MusicServicesController.name);

  constructor(private readonly musicServiceFactory: MusicServiceFactory) {}

  @Get('supported')
  getSupportedServices() {
    return {
      services: this.musicServiceFactory.getSupportedServices(),
    };
  }

  @Get(':service/test-connection')
  async testConnection(
    @Param('service') serviceType: ServiceType,
    @Req() req: RequestWithUser,
  ) {
    try {
      const service = this.musicServiceFactory.getService(serviceType);
      const accessToken = await service.getValidAccessToken(
        (req as any).user.userId,
      );
      const profile = await service.getUserProfile(accessToken);

      return {
        success: true,
        message: `Successfully connected to ${serviceType}`,
        profile,
      };
    } catch (error) {
      this.logger.error(`Failed to test ${serviceType} connection:`, error);
      return {
        success: false,
        message: `Failed to connect to ${serviceType}: ${error.message}`,
      };
    }
  }

  @Get(':service/test-playlists')
  async testPlaylists(
    @Param('service') serviceType: ServiceType,
    @Req() req: RequestWithUser,
  ) {
    try {
      const service = this.musicServiceFactory.getService(serviceType);
      const result = await service.getPlaylists((req as any).user.userId);

      return {
        success: true,
        message: `Successfully fetched ${serviceType} playlists`,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed to test ${serviceType} playlists:`, error);
      return {
        success: false,
        message: `Failed to fetch ${serviceType} playlists: ${error.message}`,
      };
    }
  }

  @Get(':service/search')
  async search(
    @Param('service') serviceType: ServiceType,
    @Query('q') query: string,
    @Query('type') type: string,
    @Query('page') page: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      if (!query) {
        throw new Error('Search query is required');
      }

      const service = this.musicServiceFactory.getService(serviceType);
      const accessToken = await service.getValidAccessToken(
        (req as any).user.userId,
      );

      const results = await service.search(
        query,
        (type?.split(',') as ('track' | 'playlist')[]) || ['track'],
        accessToken,
        page,
      );

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      this.logger.error(`Search failed for ${serviceType}:`, error);
      return {
        success: false,
        message: `Search failed: ${error.message}`,
      };
    }
  }

  @Get(':service/recommendations')
  async getRecommendations(
    @Param('service') serviceType: ServiceType,
    @Query('tracks') tracks: string,
    @Query('limit') limit: string,
    @Req() req: RequestWithUser,
  ) {
    try {
      if (!tracks) {
        throw new Error('At least one seed track is required');
      }

      const service = this.musicServiceFactory.getService(serviceType);
      const accessToken = await service.getValidAccessToken(
        (req as any).user.userId,
      );

      const recommendations = await service.getRecommendations(
        tracks.split(','),
        accessToken,
        limit ? parseInt(limit) : undefined,
      );

      return {
        success: true,
        data: recommendations,
      };
    } catch (error) {
      this.logger.error(`Recommendations failed for ${serviceType}:`, error);
      return {
        success: false,
        message: `Failed to get recommendations: ${error.message}`,
      };
    }
  }

  // Service Connection Endpoints
  @Get(':service/auth-url')
  @UseGuards(JwtAuthGuard)
  async getAuthUrl(
    @Param('service') serviceType: ServiceType,
    @Req() req: RequestWithUser,
  ) {
    try {
      const service = this.musicServiceFactory.getService(serviceType);
      const state = `${(req as any).user.userId}:${Date.now()}`;

      const authUrl = service.getAuthUrl(state);

      return {
        success: true,
        authUrl,
        state,
      };
    } catch (error) {
      this.logger.error(`Failed to get auth URL for ${serviceType}:`, error);
      return {
        success: false,
        message: `Failed to get auth URL: ${error.message}`,
      };
    }
  }

  @Get(':service/callback')
  async handleAuthCallback(
    @Param('service') serviceType: ServiceType,
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    try {
      if (error) {
        const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?error=${encodeURIComponent(error)}`;
        return res.redirect(redirectUrl);
      }

      if (!code || !state) {
        const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?error=missing_parameters`;
        return res.redirect(redirectUrl);
      }

      // Extract user ID from state
      const [userId] = state.split(':');
      if (!userId) {
        const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?error=invalid_state`;
        return res.redirect(redirectUrl);
      }

      const service = this.musicServiceFactory.getService(serviceType);
      const result = await service.handleCallback(code, userId);

      if (result.success) {
        const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?success=${encodeURIComponent(result.message)}`;
        return res.redirect(redirectUrl);
      } else {
        const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?error=${encodeURIComponent(result.message)}`;
        return res.redirect(redirectUrl);
      }
    } catch (error) {
      this.logger.error(`Auth callback failed for ${serviceType}:`, error);
      const redirectUrl = `${process.env.FRONTEND_URL}/settings/music-services?error=connection_failed`;
      return res.redirect(redirectUrl);
    }
  }

  @Post(':service/disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnectService(
    @Param('service') serviceType: ServiceType,
    @Req() req: RequestWithUser,
  ) {
    try {
      const service = this.musicServiceFactory.getService(serviceType);
      await service.disconnect((req as any).user.userId);

      return {
        success: true,
        message: `Successfully disconnected from ${serviceType}`,
      };
    } catch (error) {
      this.logger.error(`Failed to disconnect from ${serviceType}:`, error);
      return {
        success: false,
        message: `Failed to disconnect: ${error.message}`,
      };
    }
  }
}
