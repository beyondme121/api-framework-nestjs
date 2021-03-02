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
    if (password !== repassword || !password || !repassword) {
      return {
        code: -1,
        msg: '两次输入的密码不一致或者未填写',
      };
    }
    const user = await this.findOneUser(username);
    if (user) {
      return {
        code: -2,
        msg: '用户名已被注册',
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
      // 返回结果是[id, 响应记录数]  => [11, 1]  => id=11, 新增1条记录
      const result = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.INSERT,
        raw: true,
      });
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
          type: Sequelize.QueryTypes.SELECT, // 只返回结果对象, 不返回元数据对象, mysql中两者一样, 所以会输出相同的记录
          raw: true,
          logging: console.log,
        })
      )[0];
      return user;
    } catch (error) {
      return {
        code: 503,
        msg: `服务器溜号了, ${error}`,
      };
    }
  }

  async findOneUserById(id) {
    let sql = `
      SELECT username, email
      from user where id = '${id}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
          logging: true,
        })
      )[0];
      return user;
    } catch (err) {
      return {
        code: 503,
        msg: `服务器溜号了, ${err}`,
      };
    }
  }

  async findAll(): Promise<any | undefined> {
    let sql = `
      SELECT * FROM user
    `;
    try {
      const users = (await sequelize.query(sql))[0];
      return users;
    } catch (err) {}
  }
}
