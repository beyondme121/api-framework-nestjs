import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // 继承PassportStrategy, 实现validate方法
  async validate(username: string, password: string): Promise<any> {
    console.log('1. LocalStrategy.validate');
    const result = await this.authService.validateUser(username, password);
    if (!result) {
      // 全局的异常过滤器处理
      throw new UnauthorizedException();
    }
    // 如果找到了用户并且凭据有效，则返回该用户，以便 Passport 能够完成其任务(例如，在请求对象上创建user 属性)
    return result;
  }
}
