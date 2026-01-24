import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from '../common/responses/message.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<MessageResponse> {
    await this.service.register(dto);
    return { message: 'Registration successful' };
  }
}
