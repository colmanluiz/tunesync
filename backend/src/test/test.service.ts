import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async testConnection() {
    try {
      // Create a test user
      const user = await this.prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      return {
        status: 'success',
        message: 'Database connection is working!',
        userId: user.id, // Return the user ID for testing
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
