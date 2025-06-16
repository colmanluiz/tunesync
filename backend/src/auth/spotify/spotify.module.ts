import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
