import { Injectable } from '@nestjs/common';
import * as Sequelize from 'sequelize';
import { formatDate } from 'src/utils';
import { encryptPassword, makeSalt } from 'src/utils/crypto_salt';
import sequelize from '../../utils/sequelize';

@Injectable()
export class UserService {
  // 增加一个用户
  async create(reqBody: any): Promise<any> {
    const {
      username,
      chinese_name,
      password,
      repassword,
      mobile,
      email,
    } = reqBody;
    if (password !== repassword) {
      return {
        code: -1,
        msg: '两次输入的密码不一致',
      };
    }
    const user = await this.findOneUser(username);
    if (user) {
      return {
        code: -2,
        msg: '用户已经存在',
      };
    }
    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);
    const createtime = formatDate(Date.now());
    const sql = `
      INSERT INTO user
        (username, chinese_name, password, salt, email, mobile, status, create_time)
      VALUES
        ('${username}','${chinese_name}','${hashPwd}','${salt}','${email}','${mobile}', 1, '${createtime}')
    `;
    try {
      await sequelize.query(sql, { logging: true });
      return {
        code: 0,
        msg: '添加用户成功',
      };
    } catch (error) {
      return {
        code: -1,
        msg: `Service error: ${error}`,
      };
    }
  }

  /**
   * desc: 查询是否有该用户
   * @param username
   */
  async findOneUser(username: string): Promise<any | undefined> {
    let sql = `
      SELECT 
        id, username, password, salt, email
      FROM
        user
      WHERE username = '${username}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
          logging: true,
        })
      )[0];
      console.log('user: ', user);
      return user;
    } catch (error) {
      return {
        code: 503,
        msg: `服务器溜号了, ${error}`,
      };
    }
  }
}
