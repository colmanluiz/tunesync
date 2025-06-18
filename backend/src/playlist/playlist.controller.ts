import { Controller, Get, Req, Post, Body, Param } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Request } from 'express';

@Controller('playlists')
// @UseGuards(JwtAuthGuard)
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) { }

    @Get('spotify')
    async getSpotifyPlaylists(@Req() req: Request) {
        const userId = 'cmbzgmimj0000fjjw6trrkt9o';
        const accessToken =
            'BQDUohsAEs5spi59JpiVPPFkIPZkWBQSH9y-Uc4DZ0nYfsPg-HWjGTJfdZIjJ_leqY_HBNdYkeVdM4k8h7S_gM7Fn-thbii3WQb_o-MAnkm54PY3nMNffsh0vq99JP829sJuX1jsgSp_jx8RIIsNziVaqkZzOqjwdOlNHagOmzdyYJrZO-tXGREyE2ElenJku4Rl6oEJBSOvYWJBzFdf7GpIJa7xyMrqArQEk4PWE5518PhzKhopN_s';
        return this.playlistService.getSpotifyPlaylists(userId, accessToken);
    }

    @Get('spotify/test')
    async getPlaylistDetails() {
        const userId = 'cmbzgmimj0000fjjw6trrkt9o';
        const accessToken =
            'BQDUohsAEs5spi59JpiVPPFkIPZkWBQSH9y-Uc4DZ0nYfsPg-HWjGTJfdZIjJ_leqY_HBNdYkeVdM4k8h7S_gM7Fn-thbii3WQb_o-MAnkm54PY3nMNffsh0vq99JP829sJuX1jsgSp_jx8RIIsNziVaqkZzOqjwdOlNHagOmzdyYJrZO-tXGREyE2ElenJku4Rl6oEJBSOvYWJBzFdf7GpIJa7xyMrqArQEk4PWE5518PhzKhopN_s';
        const playlistId = 'cmbzk9me00007fjpvymqeh3te';

        return this.playlistService.getPlaylistDetails(
            userId,
            accessToken,
            playlistId,
        );
    }

    @Post('spotify/test')
    async createSpotifyPlaylist(
        @Body() body: { name: string; description?: string },
        @Req() req: Request,
    ) {
        const userId = 'cmbzgmimj0000fjjw6trrkt9o';
        const accessToken =
            'BQDUohsAEs5spi59JpiVPPFkIPZkWBQSH9y-Uc4DZ0nYfsPg-HWjGTJfdZIjJ_leqY_HBNdYkeVdM4k8h7S_gM7Fn-thbii3WQb_o-MAnkm54PY3nMNffsh0vq99JP829sJuX1jsgSp_jx8RIIsNziVaqkZzOqjwdOlNHagOmzdyYJrZO-tXGREyE2ElenJku4Rl6oEJBSOvYWJBzFdf7GpIJa7xyMrqArQEk4PWE5518PhzKhopN_s';

        return this.playlistService.createSpotifyPlaylist(
            userId,
            accessToken,
            body.name,
            body.description || '',
        );
    }

    @Post('spotify/:playlistId/tracks')
    async addTracksToPlaylist(
        @Param('playlistId') playlistId: string,
        @Body() body: { trackUris: string[] },
        @Req() req: Request,
    ) {
        const userId = 'cmbzgmimj0000fjjw6trrkt9o';
        const accessToken =
            'BQDUohsAEs5spi59JpiVPPFkIPZkWBQSH9y-Uc4DZ0nYfsPg-HWjGTJfdZIjJ_leqY_HBNdYkeVdM4k8h7S_gM7Fn-thbii3WQb_o-MAnkm54PY3nMNffsh0vq99JP829sJuX1jsgSp_jx8RIIsNziVaqkZzOqjwdOlNHagOmzdyYJrZO-tXGREyE2ElenJku4Rl6oEJBSOvYWJBzFdf7GpIJa7xyMrqArQEk4PWE5518PhzKhopN_s';

        return this.playlistService.addTracksToPlaylist(
            userId,
            accessToken,
            playlistId,
            body.trackUris,
        );
    }
}
