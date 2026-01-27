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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
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

  async verifyRegistration(dto: VerifyRegistrationDto): Promise<void> {
    const token = await this.tokenService.consume(dto.token);
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
      throw new UnauthorizedException('Incorrect login or password');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Verify your email address first');
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    const refreshToken = await this.tokenService.createRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refresh(
    currentRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const newToken =
      await this.tokenService.rotateRefreshToken(currentRefreshToken);

    const accessToken = await this.jwtService.signAsync({
      sub: newToken.userId,
    });
    return { accessToken, refreshToken: newToken.value };
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
}
