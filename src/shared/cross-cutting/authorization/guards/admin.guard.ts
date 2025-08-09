import type { ExecutionContext } from '@nestjs/common';
import {
  CanActivate,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('admin-jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    if (!result) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.type !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
