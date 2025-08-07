import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminUser } from '../interfaces/admin-user.interface';

export const CurrentAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AdminUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
