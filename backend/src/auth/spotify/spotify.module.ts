import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtService } from '../jwt.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [SpotifyController],
  providers: [SpotifyService, JwtService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
