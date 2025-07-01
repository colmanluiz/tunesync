import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { SafeUserDto } from './dto/safe-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        emailVerified: false, // Will be verified via email later
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const token = this.jwtService.generateToken({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    }; // this have a problem. user does not need to verify email to login.
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordVerified = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordVerified) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.generateToken({
      sub: user.id,
      email: user.email,
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };

    return {
      user: userData,
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // TODO: Implement forgot password
    // 1. Find user by email
    // 2. Generate reset token
    // 3. Send email (we'll implement this later)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // TODO: Implement password reset
    // 1. Validate reset token
    // 2. Hash new password
    // 3. Update user password
  }

  async logout(userId: string) {
    // TODO: Implement logout
    // For now, we'll just return success
    // In a more advanced implementation, we might blacklist tokens
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
        serviceConnections: {
          select: {
            id: true,
            serviceType: true,
            serviceUserId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { user };
  }

  async handleGoogleLogin(googleProfile) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleProfile.providerId },
    });

    if (!user && googleProfile.email) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email: googleProfile.email },
      });
      if (userByEmail) {
        user = await this.prisma.user.update({
          where: { id: userByEmail.id },
          data: { googleId: googleProfile.providerId },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            googleId: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }
    }

    if (!user) {
      try {
        user = await this.prisma.user.create({
          data: {
            email: googleProfile.email,
            name: googleProfile.name,
            googleId: googleProfile.providerId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            googleId: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(`${error}`);
      }
    } else {
      if (googleProfile.name && user.name !== googleProfile.name) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { name: googleProfile.name },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            googleId: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }
    }

    if (!user) {
      throw new InternalServerErrorException(
        'User could not be created or found',
      );
    }

    const token = this.jwtService.generateToken({
      sub: user.id,
      email: user.email,
    });

    return {
      user: plainToInstance(SafeUserDto, user),
      token,
    };
  }
}
