import { RedisInstance } from './../../utils/redis';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils/crypto_salt';

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
    console.log('4. 生成 JWT token, 并将token存储到redis中');
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = await this.jwtService.sign(payload);
    try {
      // 实例化redis
      const redis = await RedisInstance.initRedis('auth.certificate', 0);
      // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
      await redis.setex(`${user.id}-${user.username}`, 300, `${token}`);
      return {
        code: 0,
        access_token: token,
        msg: '登录成功',
      };
    } catch (err) {
      return {
        code: -1,
        msg: '登录失败',
      };
    }
  }
}
