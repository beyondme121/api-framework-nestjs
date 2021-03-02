import { UpdateUserDTO } from './dto/update.user.dto';
import { UserDetail } from './entities/user_detail.entity';
import {
  makeSalt,
  encryptPassword,
  checkPassword,
} from 'src/utils/crypto_salt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, ObjectType } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { UserEntity } from './entities/user.entity';

type result = {
  code: number;
  data?: object;
  msg: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    let {
      username,
      password,
      repassword,
      username_cn,
      email,
      address,
      type,
      mobile,
    } = createUserDTO;
    if (password !== repassword) {
      return {
        code: -1,
        msg: '两次输入的密码不一致或者未填写',
      };
    }
    const [allUsers, userCount] = await this.userRepository.findAndCount({
      username,
    });
    if (userCount > 0) {
      return {
        code: -2,
        msg: '用户名已被注册',
      };
    }
    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);

    // 创建用户实例
    let user = new UserEntity();
    user.username = username;
    user.password = hashPwd;
    user.userNameCN = username_cn;
    user.salt = salt;
    user.create_time = new Date();
    user.update_time = new Date();

    // 创建明细
    let userDetail = new UserDetail();
    userDetail.email = email;
    userDetail.address = address;
    userDetail.type = type;
    userDetail.mobile = mobile;
    userDetail.create_time = new Date();
    userDetail.update_time = new Date();

    // 建立关联
    user.detail = userDetail;
    // 建立了管理就可以级联保存并且在主表的entity中设置 cascade:true
    return await this.userRepository.save(user);
  }

  // 删除
  async deleteById(id: number): Promise<result> {
    const {
      raw: { affectedRows },
    } = await this.userRepository.update(id, { is_del: 1 });
    if (affectedRows) {
      return {
        code: 0,
        msg: '删除成功',
      };
    } else {
      return {
        code: 0,
        msg: '删除失败',
      };
    }
  }

  // 修改用户信息
  async modifyUserById(id: number, data: UpdateUserDTO) {
    const { password, newPassword, isDel } = data;
    const currentUser = await this.userRepository.findOne({ where: { id } });
    // 如果用户的老密码正确
    if (currentUser) {
      if (checkPassword(password, currentUser)) {
        const salt = makeSalt();
        const {
          raw: { affectedRows },
        } = await this.userRepository.update(id, {
          password: encryptPassword(newPassword, salt),
          salt: salt,
          is_del: Number(isDel),
        });
        if (affectedRows) {
          return {
            code: 0,
            msg: '修改成功',
          };
        }
      } else {
        return {
          code: -1,
          msg: '修改失败,旧密码验证错误',
        };
      }
    } else {
      return {
        code: -2,
        msg: '修改的用户不存在',
      };
    }
  }

  // 通过用户名查询用户
  async findOneByUserName(username: string): Promise<any> {
    let res = await getConnection()
      .createQueryBuilder(UserEntity, 'user')
      .where('user.username = :username', { username })
      .getOne();
    return res;
  }

  // 查询所有用户
  async userList(queryOptions) {
    const { pageSize = 10, pageNumber = 1 } = queryOptions;
    const [data, total] = await getConnection()
      .createQueryBuilder(UserEntity, 'user')
      .where('user.is_del = :is_del', { is_del: 0 })
      .orderBy({ 'user.create_time': 'DESC' })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }
}
