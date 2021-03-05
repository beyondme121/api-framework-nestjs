import { StatusCode } from './../../../../config/constants';
import { UserGroupRelationEntity } from './../entities/user/user-group-relation.entity';
import { CreateUserGroupDTO } from './../dto/group/group.create.dto';
import { UserGroupEntity } from './../entities/group/user-group.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@src/utils';
import {
  getConnection,
  Repository,
  UpdateResult,
  EntityManager,
} from 'typeorm';
import { UpdateUserGroupDTO } from '../dto/group/group.update.dto';
import { GroupUserIdsList } from '../types/user-module-types';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>,
  ) {}

  async create(createUserGroupDTO: CreateUserGroupDTO): Promise<any> {
    let { userGroupName, userGroupNameEN, parentId } = createUserGroupDTO;
    let result = await this.userGroupRepository.findOne({
      where: { userGroupName },
    });
    if (result) {
      throw new HttpException(`用户组存在,不能创建`, HttpStatus.BAD_REQUEST);
    }
    return await this.userGroupRepository.save(createUserGroupDTO);
  }

  /**
   * 软删除
   * @param id
   * @returns
   */
  async deleteById(id: number): Promise<any> {
    // 1. 更新用户组的状态为1
    // 2. 硬删除用户组与用户关联表中 userGroupId=该用户组id的记录 (用户组都删除了留着关系也没有太大的意义, 除非有召回的想法)
    // 3. TODO: 删除用户组与角色关联表中的数据
    return await getConnection().transaction(async (em: EntityManager) => {
      await em.update(UserGroupEntity, id, { status: 1 });
      await em.delete(UserGroupRelationEntity, {
        userGroupId: id,
      });
    });
  }

  /**
   *
   * @param id 用户组id
   * @param data 更新的用户组信息 (用户组的父级id, 状态)
   */
  async modifyById(id: number, data: UpdateUserGroupDTO): Promise<any> {
    let {
      raw: { affectedRows },
    } = await this.userGroupRepository.update(id, {
      ...data,
      updateTime: new Date(),
    });
    if (affectedRows) {
      return {
        code: StatusCode.SUCCESS,
        msg: '更新用户组成功',
      };
    } else {
      return {
        cdoe: StatusCode.FAILED,
        msg: '更新用户组失败',
      };
    }
  }

  /**
   * 查询所有用户组
   */
  async listAll() {
    return await this.userGroupRepository.find();
  }

  /**
   * @description 给用户组添加/删除/更新/用户: 暴力操作
   * @param groupUserIdsList: 用户组id, 用户id数组
   */
  async addOrUpdateOrDeleteUsersToGroup(
    groupUserIdsList: GroupUserIdsList,
  ): Promise<any> {
    let { userGroupId, userIdsList } = groupUserIdsList;
    // 去重用户
    let uniqueUserIdsList: number[] = Array.from(
      new Set(JSON.parse(userIdsList)),
    );
    // 1. 删除该用户组下的所有用户
    // 2. 添加所有用户
    return await getConnection()
      .transaction(async (entityManager: EntityManager) => {
        // 如果传入的是空用户id列表  ==> 删除用户组中的所有用户
        if (uniqueUserIdsList.length === 0) {
          await entityManager.delete(UserGroupRelationEntity, {
            userGroupId,
          });
          return {
            code: 0,
            msg: '删除用户组中的所有用户成功',
          };
        } else {
          // 添加或者更新 UserGroupRelation
          await entityManager.delete(UserGroupRelationEntity, {
            userGroupId,
          });
          for (const item of uniqueUserIdsList) {
            await entityManager.save(UserGroupRelationEntity, {
              userGroupId,
              userId: Number(item),
              status: 0,
              createTime: new Date(),
              updateTime: new Date(),
            });
          }
          return {
            code: 0,
            msg: '用户组添加/更新用户列表成功',
          };
        }
      })
      .then(async (data) => {
        return {
          code: StatusCode.SUCCESS,
          msg: data.msg,
          count: uniqueUserIdsList.length,
        };
      })
      .catch((err) => {
        Logger.error('用户组添加用户失败', err);
        return {
          code: StatusCode.FAILED,
          msg: '对用户组操作用户列表失败',
        };
      });
  }
}
