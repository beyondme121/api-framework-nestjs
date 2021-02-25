import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../../../config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // JWT验证 - Step 4: 被守卫调用, 这里的payload是 登录是签发的token所对应的对象 certificate中的sign(这个对象)
  async validate(payload: any) {
    console.log(`JWT验证 - Step 4: 被守卫调用`, payload);
    // payload是用户登录是后端签名的用户信息, 可以有选择的把部分用户信息字段返回给req.user字段
    return {
      userId: payload.id,
      username: payload.username,
      email: payload.email,
    };
  }
}
