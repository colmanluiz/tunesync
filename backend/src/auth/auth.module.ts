import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtService } from './jwt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SpotifyModule } from './spotify/spotify.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    SpotifyModule,
    PrismaModule,
  ],
  providers: [JwtStrategy, JwtService, AuthService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
