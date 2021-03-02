import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { StatusCode } from '../../../config/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // 继承PassportStrategy, 实现validate方法
  async validate(username: string, password: string): Promise<any> {
    const result = await this.authService.validateUser(username, password);
    switch (result.code) {
      case StatusCode.SUCCESS:
        return result.data; // 返回业务数据(用户信息) 用于token签名
      case StatusCode.PASSWORD_ERR_EXPIRE:
        throw new UnauthorizedException(result.msg);
      default:
        throw new UnauthorizedException(result.msg);
    }
  }
}
