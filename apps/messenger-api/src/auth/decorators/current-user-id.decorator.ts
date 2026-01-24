import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (key: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.userId;
    return userId ?? null;
  },
);
