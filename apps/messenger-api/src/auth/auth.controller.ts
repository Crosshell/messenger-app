import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from '../common/responses/message.response';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<MessageResponse> {
    await this.service.register(dto);
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = await this.service.login(dto);
    return { accessToken };
  }
}
