import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: 自定义装饰器 用来获取当前登录用户信息
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 登录鉴权后,将用户基本信息设置到request上, 中间件
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// 调用方法
/**
 * async findOne(@User('firstname') firstname: string) {
 *   // ...
 * }
 */
