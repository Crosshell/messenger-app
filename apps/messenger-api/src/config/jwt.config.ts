import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export function getJwtConfig(config: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: config.getOrThrow<string>('jwt.access.secret'),
    signOptions: {
      expiresIn: config.getOrThrow<StringValue>('jwt.access.expiresIn'),
    },
  };
}
