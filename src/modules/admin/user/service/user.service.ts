import { UserEntity } from './../entities/user/user.entity';
import { UserGroupRelationEntity } from './../entities/user/user-group-relation.entity';
import { UserGroupIdsList } from './../types/user-module-types';
import { IResult } from '@src/types/result-type';
import { ToolService } from '../../../../utils/tool.service';
import { UpdateUserDTO } from '../dto/user/user.update.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, EntityManager, getManager } from 'typeorm';
import { CreateUserDTO } from '../dto/user/user.create.dto';
import { ModifyPasswordDTO } from '../dto/user/user.modify.password.dto';
import { StatusCode } from '@src/config/constants';
import { Logger } from '@src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly toolservice: ToolService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    let { userName, repassword, password, ...restUserDTO } = createUserDTO;
    if (password !== repassword) {
      return {
        code: StatusCode.REPASSWORD_NOT_MATCH,
        msg: '两次输入的密码不一致',
      };
    }
    const [allUsers, userCount] = await this.userRepository.findAndCount({
      userName,
    });
    if (userCount > 0) {
      return {
        code: StatusCode.FAILED,
        msg: '用户名已被注册',
      };
    }

    const salt = this.toolservice.addSalt();
    const hashPwd = this.toolservice.encryptPassword(password, salt);
    let user = {
      ...restUserDTO,
      userName,
      password: hashPwd,
      salt,
      createTime: new Date(),
      updateTime: new Date(),
    };
    console.log('create user, ', user);
    return await this.userRepository.save(user);
  }

  // 软删除
  async deleteById(id: number): Promise<IResult> {
    const {
      raw: { affectedRows },
    } = await this.userRepository.update(id, { status: 1 });
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
    const { email, address, mobile } = data;
    let {
      raw: { affectedRows },
    } = await this.userRepository.update(id, {
      email,
      address,
      mobile,
    });
    if (affectedRows) {
      return {
        code: StatusCode.SUCCESS,
        msg: '修改成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        msg: '修改失败,未找到该用户,数据库未更新',
      };
    }
  }

  // 修改用户密码 (修改密码之后要强制token过期...重新登录)
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
          code: StatusCode.FAILED,
          msg: '密码修改失败,老密码输入错误',
        };
      }
    } else {
      return {
        code: StatusCode.NOT_FOUND,
        msg: '修改的用户不存在',
      };
    }
  }

  // 通过用户名查询用户
  async findOneByUserName(username: string): Promise<UserEntity> {
    let res = await getConnection()
      .createQueryBuilder(UserEntity, 'user')
      .where('user.username = :username', { username })
      .getOne();
    return res;
  }

  // 通过用户id查找用户
  async findOneById(id: number): Promise<any> {
    let res = await this.userRepository.findOne({ id });
    if (!res) {
      return {
        code: StatusCode.NOT_FOUND,
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
      // .where('user.is_del = :is_del', { is_del: 0 })
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

  /**
   * @description 操作(添加/更新)用户对应的用户组(1:m)
   * @param userGroupIdsList
   */
  async addOrUpdateOrDeleteOneUserToGroupList(
    userGroupIdsList: UserGroupIdsList,
  ) {
    let { userId, groupIdsList } = userGroupIdsList;
    // 去重用户组
    let uniqueGroupIdsList: number[] = Array.from(
      new Set(JSON.parse(groupIdsList)),
    );
    return await getConnection()
      .transaction(async (entityManager: EntityManager) => {
        if (uniqueGroupIdsList.length === 0) {
          await entityManager.delete(UserGroupRelationEntity, {
            userId,
          });
          return {
            code: 0,
            msg: '删除用户对应的用户组成功',
          };
        } else {
          await entityManager.delete(UserGroupRelationEntity, {
            userId,
          });
          for (const item of uniqueGroupIdsList) {
            await entityManager.save(UserGroupRelationEntity, {
              userId,
              groupId: Number(item),
              status: 0,
              createTime: new Date(),
              updateTime: new Date(),
            });
          }
          return {
            code: 0,
            msg: '操作(添加/更新)用户对应的用户组成功',
          };
        }
      })
      .then(async (data) => {
        return {
          code: StatusCode.SUCCESS,
          msg: data.msg,
          count: uniqueGroupIdsList.length,
        };
      })
      .catch((err) => {
        Logger.error('用户添加到用户组失败', err);
        return {
          code: StatusCode.FAILED,
          msg: '操作(添加/删除/更新)用户对应的用户组失败',
        };
      });
  }

  // 根据用户组id(groupId)查询所有该用户组下的所有用户
  async getUserListByGroupId(groupId: number): Promise<any> {
    // 复杂查询使用sql
    let result = await getManager().query(`
      select * 
      from user_group_relation a 
      inner join user b on a.user_id = b.id
      where a.group_id=${groupId}
    `);

    if (result) {
      return {
        code: StatusCode.SUCCESS,
        data: result,
        msg: '查询成功',
      };
    }
  }
}
