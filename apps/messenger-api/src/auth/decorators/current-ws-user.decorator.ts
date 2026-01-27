import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtPayload } from '../types/jwt-payload.interface';

export const CurrentWsUser = createParamDecorator(
  <K extends keyof JwtPayload>(key: K | undefined, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient();

    const user = client.data.user as JwtPayload | undefined;

    if (!user) {
      return null;
    }

    if (key) {
      return user[key];
    }

    return user;
  },
);
