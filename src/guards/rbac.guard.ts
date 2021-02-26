import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisInstance } from '../utils/redis';

@Injectable()
export class RbacGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    // 获取基本http信息
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // // 1. 获取请求头中的token
    const authorization = request['headers'].authorization || void 0;
    const token = authorization.split(' ')[1];

    // // 2. redis中获取token
    const redis = await RedisInstance.initRedis('JwtAuthGuard.canActive', 0);
    const key = `${user.id}-${user.username}`;
    const cache = await redis.get(key);

    // 如果 token 不匹配，禁止访问, 实现单点登录
    if (token !== cache) {
      throw new UnauthorizedException('您的账号在其他地方登录，请重新登录');
    }

    // 判断用户的角色
    return true;
  }
}
