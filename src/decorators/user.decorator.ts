// 用于对用户信息的获取
// 支持参数 获取一个用户的某个属性, 也支持获取所有属性对象
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
