import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/auth/spotify/spotify.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService,
  ) {}

  /**
   * Fetch all playlists for a user from Spotify
   * @param userId - The user's ID in our system
   * @param accessToken - The Spotify access token (optional, will be fetched if not provided)
   * @returns Array of playlists with comprehensive information
   */
  async getSpotifyPlaylists(userId: string, accessToken?: string) {
    try {
      // Use provided token or get a valid one from the database
      const validAccessToken =
        accessToken || (await this.spotifyService.getValidAccessToken(userId));

      const connection = await this.prisma.serviceConnection.findUnique({
        where: {
          userId_serviceType: {
            userId,
            serviceType: 'SPOTIFY',
          },
        },
      });

      if (!connection) {
        throw new Error('No Spotify connection found');
      }

      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${validAccessToken}`,
          },
          params: {
            limit: 50,
            offset: 0,
          },
        }),
      );

      const playlists = await Promise.all(
        data.items.map(async (playlist: any) => {
          return this.prisma.playlist.upsert({
            where: {
              userId_serviceType_serviceId: {
                userId,
                serviceType: 'SPOTIFY',
                serviceId: playlist.id,
              },
            },
            create: {
              userId,
              serviceType: 'SPOTIFY',
              serviceId: playlist.id,
              name: playlist.name,
              description: playlist.description || '',
              trackCount: playlist.tracks.total,
              public: playlist.public,
              collaborative: playlist.collaborative,
              ownerId: playlist.owner.id,
            },
            update: {
              name: playlist.name,
              description: playlist.description || '',
              trackCount: playlist.tracks.total,
              public: playlist.public,
              collaborative: playlist.collaborative,
              ownerId: playlist.owner.id,
            },
          });
        }),
      );

      return {
        success: true,
        data: {
          total: data.total,
          limit: data.limit,
          offset: data.offset,
          playlists: playlists.map((playlist) => ({
            id: playlist.id,
            serviceId: playlist.serviceId,
            name: playlist.name,
            description: playlist.description,
            trackCount: playlist.trackCount,
            public: playlist.public,
            collaborative: playlist.collaborative,
            ownerId: playlist.ownerId,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt,
            spotifyUrl: `https://open.spotify.com/playlist/${playlist.serviceId}`,
            isOwned: playlist.ownerId === connection.serviceUserId,
          })),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch Spotify playlists: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific playlist
   * @param userId - The user's ID in our system
   * @param playlistId - The playlist's ID in our system
   * @param accessToken - The Spotify access token (optional, will be fetched if not provided)
   * @returns Playlist details including tracks
   */
  async getPlaylistDetails(
    userId: string,
    playlistId: string,
    accessToken?: string,
  ) {
    try {
      // Use provided token or get a valid one from the database
      const validAccessToken =
        accessToken || (await this.spotifyService.getValidAccessToken(userId));

      const playlist = await this.prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          tracks: {
            include: { track: true },
            orderBy: { position: 'asc' },
          },
        },
      });

      if (!playlist) {
        throw new Error(`Playlist not found.`);
      }

      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://api.spotify.com/v1/playlists/${playlist.serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
            },
          },
        ),
      );

      // Update playlist with latest data from Spotify
      await this.prisma.playlist.update({
        where: { id: playlistId },
        data: {
          name: data.name,
          description: data.description,
          trackCount: data.tracks.total,
        },
      });

      const tracks = await Promise.all(
        data.tracks.items.map(async (item: any, index: number) => {
          const track = item.track;

          const storedTrack = await this.prisma.track.upsert({
            where: {
              serviceType_serviceId: {
                serviceId: track.id,
                serviceType: 'SPOTIFY',
              },
            },
            create: {
              serviceType: 'SPOTIFY',
              serviceId: track.id,
              name: track.name,
              artist: track.artists[0].name, // Using first artist for now
              album: track.album.name,
              duration: track.duration_ms,
            },
            update: {
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              duration: track.duration_ms,
            },
          });

          await this.prisma.playlistTrack.upsert({
            where: {
              playlistId_trackId: {
                playlistId,
                trackId: storedTrack.id,
              },
            },
            create: {
              playlistId,
              trackId: storedTrack.id,
              position: index,
            },
            update: {
              position: index,
            },
          });

          return storedTrack;
        }),
      );

      return {
        success: true,
        playlist: {
          ...playlist,
          name: data.name, // Include updated name
          description: data.description, // Include updated description
          trackCount: data.tracks.total, // Include updated track count
          tracks,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch playlist details: ${error.message}`);
    }
  }

  /**
   * Create a new playlist on Spotify
   * @param userId - The user's ID in our system
   * @param name - The name of the playlist
   * @param description - Optional description of the playlist
   * @param accessToken - The Spotify access token (optional, will be fetched if not provided)
   * @returns The created playlist
   */
  async createSpotifyPlaylist(
    userId: string,
    name: string,
    description: string,
    accessToken?: string,
  ) {
    try {
      // Use provided token or get a valid one from the database
      const validAccessToken =
        accessToken || (await this.spotifyService.getValidAccessToken(userId));

      const { data: profile } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${validAccessToken}`,
          },
        }),
      );

      const { data: spotifyPlaylist } = await firstValueFrom(
        this.httpService.post(
          `https://api.spotify.com/v1/users/${profile.id}/playlists`,
          {
            name,
            description: description || '',
            public: false, // private playlist
          },
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const playlist = await this.prisma.playlist.create({
        data: {
          userId,
          serviceType: 'SPOTIFY',
          serviceId: spotifyPlaylist.id,
          name: spotifyPlaylist.name,
          description: spotifyPlaylist.description || '',
        },
      });

      return {
        success: true,
        playlist,
      };
    } catch (error) {
      throw new Error(`Failed to create Spotify playlist: ${error.message}`);
    }
  }

  /**
   * Add tracks to a Spotify playlist
   * @param userId - The user's ID in our system
   * @param playlistId - The playlist's ID in our system
   * @param trackUris - Array of Spotify track URIs to add
   * @param accessToken - The Spotify access token (optional, will be fetched if not provided)
   * @returns The updated playlist with its tracks
   */
  async addTracksToPlaylist(
    userId: string,
    playlistId: string,
    trackUris: string[],
    accessToken?: string,
  ) {
    try {
      // Use provided token or get a valid one from the database
      const validAccessToken =
        accessToken || (await this.spotifyService.getValidAccessToken(userId));

      const playlist = await this.prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          tracks: {
            include: { track: true },
            orderBy: { position: 'asc' },
          },
        },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const { data: spotifyResponse } = await firstValueFrom(
        this.httpService.post(
          `https://api.spotify.com/v1/playlists/${playlist.serviceId}/tracks`,
          {
            uris: trackUris,
          },
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const { data: updatedSpotifyPlaylist } = await firstValueFrom(
        this.httpService.get(
          `https://api.spotify.com/v1/playlists/${playlist.serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${validAccessToken}`,
            },
          },
        ),
      );

      const tracks = await Promise.all(
        updatedSpotifyPlaylist.tracks.items.map(
          async (item: any, index: number) => {
            const track = item.track;

            const storedTrack = await this.prisma.track.upsert({
              where: {
                serviceType_serviceId: {
                  serviceId: track.id,
                  serviceType: 'SPOTIFY',
                },
              },
              create: {
                serviceType: 'SPOTIFY',
                serviceId: track.id,
                name: track.name,
                artist: track.artists[0].name, // Using first artist for now
                album: track.album.name,
                duration: track.duration_ms,
              },
              update: {
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                duration: track.duration_ms,
              },
            });

            await this.prisma.playlistTrack.upsert({
              where: {
                playlistId_trackId: {
                  playlistId,
                  trackId: storedTrack.id,
                },
              },
              create: {
                playlistId,
                trackId: storedTrack.id,
                position: index,
              },
              update: {
                position: index,
              },
            });

            return storedTrack;
          },
        ),
      );

      await this.prisma.playlist.update({
        where: { id: playlistId },
        data: {
          trackCount: updatedSpotifyPlaylist.tracks.total,
        },
      });

      return {
        success: true,
        playlist: {
          ...playlist,
          trackCount: updatedSpotifyPlaylist.tracks.total,
          tracks,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to add track do the Spotify playlist: ${error.message}`,
      );
    }
  }
}
