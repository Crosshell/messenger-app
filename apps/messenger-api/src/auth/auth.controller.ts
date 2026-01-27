import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from '../common/responses/message.response';
import { LoginDto } from './dto/login.dto';
import type { CookieOptions, Response } from 'express';
import { Authorization } from './decorators/authorization.decorator';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './decorators/refresh-token.decorator';

@Controller('auth')
export class AuthController {
  private readonly cookieRefreshTokenConfig: CookieOptions;

  constructor(
    private readonly service: AuthService,
    private readonly config: ConfigService,
  ) {
    this.cookieRefreshTokenConfig = this.config.getOrThrow<CookieOptions>(
      'cookie.refreshToken',
    );
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<MessageResponse> {
    await this.service.register(dto);
    return { message: 'Registration successful. Verify your email address' };
  }

  @Post('register/verify')
  @HttpCode(HttpStatus.OK)
  async verifyRegistration(
    @Query('token', ParseUUIDPipe) token: string,
  ): Promise<MessageResponse> {
    await this.service.verifyRegistration(token);
    return { message: 'Registration verified successfully' };
  }

  @Post('register/verify/resend')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<MessageResponse> {
    await this.service.resendVerification(dto);
    return { message: 'Verification email sent' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, accessToken } = await this.service.login(dto);
    res.cookie('refreshToken', refreshToken, this.cookieRefreshTokenConfig);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  async refresh(
    @RefreshToken() currentRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, accessToken } =
      await this.service.refresh(currentRefreshToken);
    res.cookie('refreshToken', refreshToken, this.cookieRefreshTokenConfig);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Authorization()
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponse> {
    res.clearCookie('refreshToken');
    return { message: 'Successfully logged out' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<MessageResponse> {
    await this.service.forgotPassword(dto);
    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponse> {
    await this.service.resetPassword(dto);
    return { message: 'Password reset successfully' };
  }
}
