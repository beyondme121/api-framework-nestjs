import { UserEntity } from './../modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class ToolService {
  // 产生随机盐
  addSalt(): string {
    return crypto.randomBytes(10).toString('base64');
  }

  // 用户密码加密
  encryptPassword(password: string, salt: string): string {
    if (!password || !salt) {
      return '';
    }
    const temp = Buffer.from(salt, 'base64');
    return crypto
      .pbkdf2Sync(password, temp, 10000, 16, 'sha1')
      .toString('base64');
  }

  // 校验用户密码是否正确
  checkPassword(clientPassword: string, user: UserEntity): boolean {
    const hashedPwd = user.password;
    const salt = user.salt;
    const hashClientPwd = this.encryptPassword(clientPassword, salt);
    return hashClientPwd === hashedPwd ? true : false;
  }
}
