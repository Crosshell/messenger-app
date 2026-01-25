import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();

    const token = request.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      request['user'] = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid token');
    }

    return true;
  }
}
