import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { hash, verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { TokenType } from '@prisma/client';
import { TokenService } from '../token/token.service';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const existingUser = await this.userService.findByEmailOrUsername(
      dto.email,
      dto.username,
    );

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === dto.username) {
        throw new ConflictException('User with this username already exists');
      }
    }

    const hashedPassword = await hash(dto.password);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const token = await this.tokenService.create(user.id, TokenType.EMAIL);

    await this.emailService.sendVerificationEmail(
      dto.email,
      dto.username,
      token,
    );
  }

  async verifyRegistration(tokenValue: string): Promise<void> {
    const token = await this.tokenService.consume(tokenValue);
    if (!token) {
      throw new BadRequestException('Invalid or expired verification token');
    }
    await this.userService.markEmailAsVerified(token.userId);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOneWithPassword(dto.login);

    const isValid = user && (await verify(user.password, dto.password));
    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Verify your email address first');
    }

    return this.generateAuthTokens({ sub: user.id });
  }

  async refresh(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOneOrThrow({ id: userId });
    if (!user.isEmailVerified) {
      throw new ForbiddenException('Verify your email address first');
    }
    return this.generateAuthTokens({ sub: user.id });
  }

  async resendVerification(dto: ResendVerificationDto): Promise<void> {
    const user = await this.userService.findOneOrThrow({ email: dto.email });
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const token = await this.tokenService.create(user.id, TokenType.EMAIL);

    await this.emailService.sendVerificationEmail(
      dto.email,
      user.username,
      token,
    );
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOneOrThrow({
      email: dto.email,
    });

    const token = await this.tokenService.create(user.id, TokenType.PASSWORD);
    await this.emailService.sendPasswordResetEmail(
      dto.email,
      user.username,
      token,
    );
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const data = await this.tokenService.consume(dto.token);
    if (!data) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await hash(dto.password);

    await this.userService.updatePassword(data.userId, hashedPassword);
  }

  private async generateAuthTokens(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.config.getOrThrow<number>('jwt.refresh.expiresIn'),
      secret: this.config.getOrThrow<string>('jwt.refresh.secret'),
    });

    return { accessToken, refreshToken };
  }
}
