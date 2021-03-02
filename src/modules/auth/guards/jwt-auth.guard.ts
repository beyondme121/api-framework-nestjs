import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
// 创建自己的类
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflect: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. 设置跳过jwt验证的步骤
    const skipAuth = this.reflect.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException({ msg: 'token验证失败,请重新登录' })
      );
    }
    return user;
  }
}
