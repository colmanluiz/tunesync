import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
    PrismaModule,
  ],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
