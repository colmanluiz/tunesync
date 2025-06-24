import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PlaylistSyncService, SyncOptions } from './playlist-sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface CreateSyncDto {
  sourcePlaylistId: string;
  targetPlaylistId: string;
  options?: SyncOptions;
}

@Controller('playlist-sync')
@UseGuards(JwtAuthGuard)
export class PlaylistSyncController {
  constructor(private readonly playlistSyncService: PlaylistSyncService) {}

  /**
   * Create a new sync relationship between two playlists
   */
  @Post()
  async createSync(@Request() req, @Body() createSyncDto: CreateSyncDto) {
    try {
      const { sourcePlaylistId, targetPlaylistId, options } = createSyncDto;
      const userId = req.user.userId;

      const result = await this.playlistSyncService.createSync(
        userId,
        sourcePlaylistId,
        targetPlaylistId,
        options,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get all sync relationships for the authenticated user
   */
  @Get()
  async getUserSyncs(@Request() req) {
    try {
      const userId = req.user.userId;

      return await this.playlistSyncService.getUserSyncs(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Perform a sync operation for a specific sync relationship
   */
  @Post(':syncId/sync')
  async performSync(@Request() req, @Param('syncId') syncId: string) {
    try {
      const userId = req.user.userId;
      const result = await this.playlistSyncService.performSync(userId, syncId);

      return {
        success: true,
        message: `Successfully synced ${result.syncedTracks} tracks`,
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a sync relationship
   */
  @Delete(':syncId')
  async deleteSync(@Request() req, @Param('syncId') syncId: string) {
    try {
      const userId = req.user.userId;
      return await this.playlistSyncService.deleteSync(userId, syncId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
