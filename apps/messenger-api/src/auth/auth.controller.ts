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
import type { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { Authorization } from './decorators/authorization.decorator';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

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
    res.cookie('refreshToken', refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  async refresh(
    @CurrentUser('sub') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { refreshToken, accessToken } = await this.service.refresh(userId);
    res.cookie('refreshToken', refreshToken);
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
}
