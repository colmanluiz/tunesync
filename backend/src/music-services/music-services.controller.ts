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
} from '@nestjs/common';
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
}
