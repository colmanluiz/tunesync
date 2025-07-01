import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { env } from 'process';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    this.client = new Redis({
      host: env.REDIS_HOST || 'redis',
      port: Number(env.REDIS_PORT) || 6379,
    });
    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  /**
   * Set a key with a string value and TTL (in seconds)
   */
  async set(key: string, data: string, ttlInSeconds: number): Promise<void> {
    await this.client.set(key, data, 'EX', ttlInSeconds);
  }

  /**
   * Get a string value by key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Atomically get and delete a key
   */
  async getAndDelete(key: string): Promise<string | null> {
    return this.client.getdel(key);
  }

  /**
   * Delete a key
   */
  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }
}
