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
    console.log('2. auth.service.validateUser');
    const user = await this.userService.findOneUser(username);
    if (user) {
      const hashedPwd = user.password;
      const salt = user.salt;
      const hashClientPwd = encryptPassword(password, salt);
      const { id, username, email } = user;
      if (hashedPwd === hashClientPwd) {
        return {
          code: 0,
          data: {
            id,
            username,
            email,
          },
          msg: '用户名密码验证通过',
        };
      } else {
        return {
          code: -1,
          data: null,
          msg: '密码错误或过期',
        };
      }
    } else {
      return {
        code: -2,
        data: null,
        msg: '查无此人',
      };
    }
  }

  // 验证通过后签发token, 将有用的非敏感信息, 放到payload中
  async certificate(user: any) {
    console.log('4. 生成 JWT token');
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
