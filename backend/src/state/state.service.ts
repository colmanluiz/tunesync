import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import * as crypto from 'crypto';

@Injectable()
export class StateService {
  private readonly STATE_PREFIX = 'state:';
  private readonly STATE_TTL = 300; // 5 minutes

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a state token for OAuth, store userId in Redis, and return the state string
   */
  async createState(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('User ID does not match to any existant user.');

    const state = crypto.randomBytes(16).toString('hex');
    await this.redisService.set(
      this.STATE_PREFIX + state,
      user.id,
      this.STATE_TTL,
    );

    return state;
  }

  /**
   * Atomically get and delete the userId by state token (prevents replay attacks)
   */
  async popUserIdByState(state: string): Promise<string | null> {
    const cacheKey = this.STATE_PREFIX + state;
    const userId = await this.redisService.getAndDelete(cacheKey);
    if (userId) {
      return userId;
    }
    throw new Error('No userId found for this state (or state already used)');
  }

  /**
   * Delete a state token manually
   */
  async deleteState(state: string): Promise<number> {
    return this.redisService.delete(this.STATE_PREFIX + state);
  }
}
