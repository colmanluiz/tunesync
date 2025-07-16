import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { MusicServiceFactory } from './music-service.factory';
import { SpotifyModule } from './spotify/spotify.module';
import { SpotifyService } from './spotify/spotify.service';
import { YouTubeModule } from './youtube/youtube.module';
import { YouTubeService } from './youtube/youtube.service';
import { MusicServicesController } from './music-services.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
    PrismaModule,
    SpotifyModule,
    YouTubeModule,
  ],
  controllers: [MusicServicesController],
  providers: [MusicServiceFactory, SpotifyService, YouTubeService],
  exports: [MusicServiceFactory],
})
export class MusicServicesModule implements OnModuleInit {
  constructor(
    private readonly musicServiceFactory: MusicServiceFactory,
    private readonly spotifyService: SpotifyService,
    private readonly youtubeService: YouTubeService,
  ) {}

  onModuleInit() {
    // Register available music services
    this.musicServiceFactory.registerService('SPOTIFY', SpotifyService);
    this.musicServiceFactory.registerService('YOUTUBE', YouTubeService);
  }
}
