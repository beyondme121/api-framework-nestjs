import { IResult } from '@src/types/result-type';
import { ToolService } from './../../utils/tool.service';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UserDetail } from './entities/user_detail.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { UserEntity } from './entities/user.entity';
import { ModifyPasswordDTO } from './dto/modify.password.dto';
import { StatusCode } from '@src/config/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly toolservice: ToolService,
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
        code: StatusCode.REPASSWORD_NOT_MATCH,
        msg: '两次输入的密码不一致',
      };
    }
    const [allUsers, userCount] = await this.userRepository.findAndCount({
      username,
    });
    if (userCount > 0) {
      return {
        code: StatusCode.USER_EXISTS,
        msg: '用户名已被注册',
      };
    }

    const salt = this.toolservice.addSalt();
    const hashPwd = this.toolservice.encryptPassword(password, salt);

    // 创建用户实例
    let user = new UserEntity();
    Object.assign(user, {
      username,
      password: hashPwd,
      userNameCN: username_cn,
      salt,
      create_time: new Date(),
      update_time: new Date(),
      email,
      address,
      type,
      mobile,
    });

    // 创建明细
    let userDetail = new UserDetail();
    Object.assign(userDetail, {
      email,
      address,
      type,
      mobile,
      create_time: new Date(),
      update_time: new Date(),
    });

    // 建立关联
    user.detail = userDetail;
    // 建立了管理就可以级联保存并且在主表的entity中设置 cascade:true
    return await this.userRepository.save(user);
  }

  // 软删除
  async deleteById(id: number): Promise<IResult> {
    const {
      raw: { affectedRows },
    } = await this.userRepository.update(id, { is_del: 1 });
    if (affectedRows) {
      return {
        code: StatusCode.SUCCESS,
        msg: '删除成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        msg: '删除失败',
      };
    }
  }

  // 修改用户基本信息
  async modifyUserById(id: number, data: UpdateUserDTO) {
    const { email, address, mobile, type } = data;
    const currentUser = await this.userRepository.findOne({ where: { id } });
    // 如果用户的老密码正确
    if (currentUser) {
      let {
        raw: { affectedRows },
      } = await this.userRepository.update(id, {
        email,
        address,
        mobile,
        type,
      });
      if (affectedRows) {
        return {
          code: StatusCode.SUCCESS,
          msg: '修改成功',
        };
      } else {
        return {
          code: StatusCode.FAILED,
          msg: '修改失败',
        };
      }
    } else {
      return {
        code: StatusCode.NOT_FOUND_USER,
        msg: '修改的用户不存在',
      };
    }
  }

  // 修改用户密码
  async modifyPasswordById(id: number, data: ModifyPasswordDTO) {
    const { password, newPassword } = data;
    const currentUser = await this.userRepository.findOne({ where: { id } });
    // 如果用户的老密码正确
    if (currentUser) {
      if (this.toolservice.checkPassword(password, currentUser)) {
        const salt = this.toolservice.addSalt();
        const {
          raw: { affectedRows },
        } = await this.userRepository.update(id, {
          password: this.toolservice.encryptPassword(newPassword, salt),
          salt: salt,
        });
        if (affectedRows) {
          return {
            code: StatusCode.SUCCESS,
            msg: '修改成功',
          };
        }
      } else {
        return {
          code: StatusCode.PASSWORD_ERR_EXPIRE,
          msg: '密码修改失败,老密码输入错误',
        };
      }
    } else {
      return {
        code: StatusCode.NOT_FOUND_USER,
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

  // 通过用户id查找用户
  async findOneById(id: number): Promise<any> {
    let res = await this.userRepository.findOne({ id, is_del: 0 });
    if (!res) {
      return {
        code: StatusCode.NOT_FOUND_USER,
        msg: '用户不存在',
      };
    }
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
