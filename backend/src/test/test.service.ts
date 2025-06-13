import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
    constructor(private prisma: PrismaService) { }

    async testConnection() {
        try {
            // Try to create a test user
            const user = await this.prisma.user.create({
                data: {
                    email: 'test@example.com',
                    name: 'Test User',
                },
            });

            // Delete the test user
            await this.prisma.user.delete({
                where: { id: user.id },
            });

            return { status: 'success', message: 'Database connection is working!' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
} 