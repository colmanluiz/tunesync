import { Controller, Get, Req, Post, Body, Param } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Request } from 'express';

@Controller('playlists')
// @UseGuards(JwtAuthGuard)
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) { }

    @Get('spotify')
    async getSpotifyPlaylists(@Req() req: Request) {
        const userId = 'cmc5aljc90000fjfsoiogp7nq';
        const accessToken =
            'BQBSjLsTMJbxyx2YGUar4GCfazmblq7eDHbmIofiDLLbXPY9udLa5ggp3y034Jg2Z73qw2IlBbksgdB1Evp_IULRZyNhp_ibwMScZGiWUWxD6uJ22L0fHez04QeqMO9SK-URUhQ5M3i5hPLnKVU1aOHBjy2nqAH0kkleN01N4OZE2xauptmrX3zeIGVTnbIq3V3qlhBQ1x6gmYp8bnIWn_Dk4b7Tpn2gdfjPPWZRxbLsmdss2qZIiJu26JV-rfifqIy1Cs4MDm2jJgCJTUc7_EDuiDIi0ATmxRXm0KtjHuPhe4A';
        return this.playlistService.getSpotifyPlaylists(userId, accessToken);
    }

    @Get('spotify/test')
    async getPlaylistDetails() {
        const userId = 'cmc5aljc90000fjfsoiogp7nq';
        const accessToken =
            'BQBSjLsTMJbxyx2YGUar4GCfazmblq7eDHbmIofiDLLbXPY9udLa5ggp3y034Jg2Z73qw2IlBbksgdB1Evp_IULRZyNhp_ibwMScZGiWUWxD6uJ22L0fHez04QeqMO9SK-URUhQ5M3i5hPLnKVU1aOHBjy2nqAH0kkleN01N4OZE2xauptmrX3zeIGVTnbIq3V3qlhBQ1x6gmYp8bnIWn_Dk4b7Tpn2gdfjPPWZRxbLsmdss2qZIiJu26JV-rfifqIy1Cs4MDm2jJgCJTUc7_EDuiDIi0ATmxRXm0KtjHuPhe4A';
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
        const userId = 'cmc5aljc90000fjfsoiogp7nq';
        const accessToken =
            'BQBSjLsTMJbxyx2YGUar4GCfazmblq7eDHbmIofiDLLbXPY9udLa5ggp3y034Jg2Z73qw2IlBbksgdB1Evp_IULRZyNhp_ibwMScZGiWUWxD6uJ22L0fHez04QeqMO9SK-URUhQ5M3i5hPLnKVU1aOHBjy2nqAH0kkleN01N4OZE2xauptmrX3zeIGVTnbIq3V3qlhBQ1x6gmYp8bnIWn_Dk4b7Tpn2gdfjPPWZRxbLsmdss2qZIiJu26JV-rfifqIy1Cs4MDm2jJgCJTUc7_EDuiDIi0ATmxRXm0KtjHuPhe4A';

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
        const userId = 'cmc5aljc90000fjfsoiogp7nq';
        const accessToken =
            'BQBSjLsTMJbxyx2YGUar4GCfazmblq7eDHbmIofiDLLbXPY9udLa5ggp3y034Jg2Z73qw2IlBbksgdB1Evp_IULRZyNhp_ibwMScZGiWUWxD6uJ22L0fHez04QeqMO9SK-URUhQ5M3i5hPLnKVU1aOHBjy2nqAH0kkleN01N4OZE2xauptmrX3zeIGVTnbIq3V3qlhBQ1x6gmYp8bnIWn_Dk4b7Tpn2gdfjPPWZRxbLsmdss2qZIiJu26JV-rfifqIy1Cs4MDm2jJgCJTUc7_EDuiDIi0ATmxRXm0KtjHuPhe4A';

        return this.playlistService.addTracksToPlaylist(
            userId,
            accessToken,
            playlistId,
            body.trackUris,
        );
    }
}
