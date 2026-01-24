import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export function getJwtConfig(config: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: config.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN'),
    },
  };
}
