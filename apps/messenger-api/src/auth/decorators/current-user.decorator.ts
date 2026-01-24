import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  <K extends keyof JwtPayload>(key: K | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;

    if (!user) {
      return null;
    }

    if (key) {
      return user[key];
    }

    return user;
  },
);
