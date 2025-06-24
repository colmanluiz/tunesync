import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import getSpotifyUris from 'src/lib/getSpotifyUris';

export interface SyncOptions {
  syncName?: string;
  autoSync?: boolean;
  syncInterval?: number; // in minutes
}

@Injectable()
export class PlaylistSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Create a sync relationship between two playlists
   * @param userId - The user's ID
   * @param sourcePlaylistId - Source playlist ID (our system)
   * @param targetPlaylistId - Target playlist ID (our system)
   * @param options - Sync configuration options
   */
  async createSync(
    userId: string,
    sourcePlaylistId: string,
    targetPlaylistId: string,
    options: SyncOptions = {},
  ) {
    try {
      const [sourcePlaylist, targetPlaylist] = await Promise.all([
        this.prisma.playlist.findFirst({
          where: { id: sourcePlaylistId, userId },
        }),
        this.prisma.playlist.findFirst({
          where: { id: targetPlaylistId, userId },
        }),
      ]);

      if (!sourcePlaylist) {
        throw new Error('Source playlist not found or access denied');
      }

      if (!targetPlaylist) {
        throw new Error('Target playlist not found or access denied');
      }

      if (sourcePlaylistId === targetPlaylistId) {
        throw new Error('Cannot sync a playlist with itself');
      }

      const sync = await this.prisma.playlistSync.create({
        data: {
          userId,
          sourceId: sourcePlaylistId,
          targetId: targetPlaylistId,
          status: 'SUCCESS',
        },
        include: {
          sourcePlaylist: true,
          targetPlaylist: true,
        },
      });

      return {
        success: true,
        sync: {
          id: sync.id,
          sourcePlaylist: {
            id: sync.sourcePlaylist.id,
            name: sync.sourcePlaylist.name,
            serviceType: sync.sourcePlaylist.serviceType,
          },
          targetPlaylist: {
            id: sync.targetPlaylist.id,
            name: sync.targetPlaylist.name,
            serviceType: sync.targetPlaylist.serviceType,
          },
          status: sync.status,
          lastSyncedAt: sync.lastSyncedAt,
          createdAt: sync.createdAt,
        },
      };
    } catch (error) {
      throw new Error(`Failed to create sync: ${error.message}`);
    }
  }

  /**
   * Perform a sync operation from source to target playlist
   * @param userId - The user's ID
   * @param syncId - The sync relationship ID
   */
  async performSync(userId: string, syncId: string) {
    try {
      const sync = await this.prisma.playlistSync.findFirst({
        where: { id: syncId, userId },
        include: {
          sourcePlaylist: {
            include: {
              tracks: {
                include: {
                  track: true,
                },
                orderBy: { position: 'asc' },
              },
            },
          },
          targetPlaylist: {
            include: {
              tracks: {
                include: {
                  track: true,
                },
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      });

      if (!sync)
        throw new Error('Sync relationship not found or access denied.');

      await this.prisma.playlistSync.update({
        where: { id: syncId },
        data: { status: 'IN_PROGRESS' },
      });

      const sourceTracks = sync.sourcePlaylist.tracks;
      const targetTracks = sync.targetPlaylist.tracks;

      const connection = await this.prisma.serviceConnection.findUnique({
        where: {
          userId_serviceType: {
            userId,
            serviceType: sync.targetPlaylist.serviceType,
          },
        },
      });

      if (!connection) {
        throw new Error(
          `No ${sync.targetPlaylist.serviceType} connection found`,
        );
      }

      // For now, we'll implement Spotify sync
      if (sync.targetPlaylist.serviceType === 'SPOTIFY') {
        return await this.syncToSpotify(
          sync,
          sourceTracks,
          targetTracks,
          connection.accessToken,
        );
      }

      throw new Error(
        `Unsupported service type: ${sync.targetPlaylist.serviceType}`,
      );
    } catch (error) {
      await this.prisma.playlistSync.update({
        where: { id: syncId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      // this.logger.error(`Sync failed: ${error.message}`);
      // throw error;
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  /**
   * Get all sync relationships for a user
   * @param userId - The user's ID
   */
  async getUserSyncs(userId: string) {
    try {
      const syncs = await this.prisma.playlistSync.findMany({
        where: { userId },
        include: {
          sourcePlaylist: true,
          targetPlaylist: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      return {
        success: true,
        data: syncs.map((sync) => ({
          id: sync.id,
          sourcePlaylist: {
            id: sync.sourcePlaylist.id,
            name: sync.sourcePlaylist.name,
            serviceType: sync.sourcePlaylist.serviceType,
            trackCount: sync.sourcePlaylist.trackCount,
          },
          targetPlaylist: {
            id: sync.targetPlaylist.id,
            name: sync.targetPlaylist.name,
            serviceType: sync.targetPlaylist.serviceType,
            trackCount: sync.targetPlaylist.trackCount,
          },
          status: sync.status,
          lastSyncedAt: sync.lastSyncedAt,
          errorMessage: sync.errorMessage,
          createdAt: sync.createdAt,
          updatedAt: sync.updatedAt,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to get user syncs: ${error.message}`);
    }
  }
}
