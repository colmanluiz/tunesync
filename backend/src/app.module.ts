import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TestModule } from './test/test.module';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthModule } from './auth/auth.module';
import { MusicServicesModule } from './music-services/music-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TestModule,
    PlaylistModule,
    AuthModule,
    MusicServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
