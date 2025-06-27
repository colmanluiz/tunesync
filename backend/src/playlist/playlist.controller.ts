import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    spotifyAccessToken?: string;
  };
}

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) { }

  @Get('spotify')
  async getSpotifyPlaylists(@Req() req: RequestWithUser) {
    const { userId, spotifyAccessToken } = req.user;
    return this.playlistService.getSpotifyPlaylists(userId, spotifyAccessToken);
  }

  @Get('spotify/:playlistId')
  async getPlaylistDetails(
    @Req() req: RequestWithUser,
    @Param('playlistId') playlistId: string,
  ) {
    const { userId, spotifyAccessToken } = req.user;
    return this.playlistService.getPlaylistDetails(
      userId,
      playlistId,
      spotifyAccessToken,
    );
  }

  @Post('spotify')
  async createSpotifyPlaylist(
    @Body() body: { name: string; description?: string },
    @Req() req: RequestWithUser,
  ) {
    const { userId, spotifyAccessToken } = req.user;
    return this.playlistService.createSpotifyPlaylist(
      userId,
      body.name,
      body.description || '',
      spotifyAccessToken,
    );
  }

  @Post('spotify/:playlistId/tracks')
  async addTracksToPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() body: { trackUris: string[] },
    @Req() req: RequestWithUser,
  ) {
    const { userId, spotifyAccessToken } = req.user;
    return this.playlistService.addTracksToPlaylist(
      userId,
      playlistId,
      body.trackUris,
      spotifyAccessToken,
    );
  }
}
