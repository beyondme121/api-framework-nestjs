import { ToolService } from './../../utils/tool.service';
import { RedisInstance } from './../../utils/redis';
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusCode } from '../../config/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly toolService: ToolService,
  ) {}
  // JWT验证 - Step 2: 校验用户信息 (根据用户名和密码验证)
  async validateUser(username: string, clientPassword: string): Promise<any> {
    const user = await this.userService.findOneByUserName(username);
    if (user) {
      const { password: dbPassword, salt } = user;
      const hashClientPwd = this.toolService.encryptPassword(
        clientPassword,
        salt,
      );
      if (dbPassword === hashClientPwd) {
        return {
          code: StatusCode.SUCCESS,
          data: {
            // 使用属性访问器 在UserEntity中定义的, 自定义返回不敏感的用户属性字段
            ...user.toResponseObject,
          },
          msg: '用户名密码验证通过',
        };
      } else {
        return {
          code: StatusCode.PASSWORD_ERR_EXPIRE,
          data: null,
          msg: '密码错误或过期',
        };
      }
    } else {
      return {
        code: StatusCode.NOT_FOUND_USER,
        data: null,
        msg: '用户不存在',
      };
    }
  }

  // 验证通过后签发token, 将有用的非敏感信息, 放到payload中
  async certificate(user: any) {
    console.log('4. 生成 JWT token, 并将token存储到redis中', user);
    const token = await this.jwtService.sign(user);
    try {
      // 实例化redis
      const redis = await RedisInstance.initRedis('auth.certificate', 0);
      // 将用户信息和 token 存入 redis，并设置失效时间，语法：[key, seconds, value]
      await redis.setex(`${user.id}-${user.username}`, 60 * 60, `${token}`);
      return {
        code: 0,
        access_token: token,
        data: user, // 返回不敏感的用户信息
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
