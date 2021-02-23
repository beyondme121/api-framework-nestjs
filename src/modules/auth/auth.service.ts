import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { encryptPassword } from 'src/utils/crypto_salt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // JWT验证 - Step 2: 校验用户信息 (根据用户名和密码验证)
  async validateUser(username: string, password: string): Promise<any> {
    console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.userService.findOneUser(username);
    if (user) {
      const hashedPwd = user.password;
      const salt = user.salt;
      // 对客户端请求来的密码进行加密后和数据库中的密码对比
      const hashClientPwd = encryptPassword(password, salt);
      if (hashedPwd === hashClientPwd) {
        return {
          code: 0,
          user,
        };
      } else {
        return {
          code: -1,
          user: null,
          msg: '密码错误或过期',
        };
      }
    } else {
      return {
        code: -2,
        user: null,
        msg: '查无此人',
      };
    }
  }

  // 验证通过后签发token
  async certificate(user: any) {
    const payload = {
      userid: user.id,
      username: user.username,
    };
    console.log('JWT token 生成');
    try {
      const token = this.jwtService.sign(payload);
      return {
        code: 0,
        token,
        msg: '签发token成功',
      };
    } catch (error) {
      return {
        code: -1,
        msg: '账号或密码错误',
      };
    }
  }
}
