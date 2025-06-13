import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Request } from 'express';

@Controller('auth/spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) { }

    @Get('login')
    login() {
        const authUrl = this.spotifyService.getAuthUrl();
        return { url: authUrl };
    }

    @Get('callback')
    async callback(@Query('code') code: string, @Req() req: Request) {
        // TODO: Get actual user ID from session/auth
        const userId = 'temp-user-id';
        return this.spotifyService.handleCallback(code, userId);
    }
} 