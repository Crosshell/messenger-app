import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtConfig(config: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: config.getOrThrow<string>('jwt.secret'),
    signOptions: {
      expiresIn: config.getOrThrow<number>('jwt.expiresIn'),
    },
  };
}
