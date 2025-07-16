import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { YouTubeService } from './youtube.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
    PrismaModule,
  ],
  providers: [YouTubeService],
  exports: [YouTubeService],
})
export class YouTubeModule {}
