import { ToolService } from '../../../utils/tool.service';
import { IResult } from '@src/types/result-type';
import { StatusCode } from '@src/config/constants';
import { CreateRoleDto } from './dto/create.role.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, UpdateResult, InsertResult } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { RedisUtilService } from '../../redis-utils/redis.service';
import { UpdateRoleDto } from './dto/update.role.dto';
import { ObjectType } from '@src/types';
import { QueryOptionsRoleDTO } from './dto/query.options.role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @Inject(RedisUtilService)
    private readonly redisCacheService: RedisUtilService,
    private readonly toolService: ToolService,
  ) {}

  // 创建角色
  async create(user: ObjectType, createRoleDto: CreateRoleDto) {
    let { roleName, roleDesc } = createRoleDto;
    let result = await this.findByRoleName(roleName);
    if (result) {
      return {
        code: StatusCode.FAILED,
        msg: '角色名称已存在',
      };
    }
    let userId = user.id;
    // 组织Role实体对应的数据
    let obj = {
      roleName,
      roleDesc,
      createdByUserId: userId,
      create_time: new Date(),
      update_time: new Date(),
    };
    let data = await this.roleRepository.save(obj);
    if (data) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '角色创建成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        data,
        msg: '角色创建失败',
      };
    }
    // 批量插入的方式 values(对象数组)
    // await getConnection()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(RoleEntity)
    //   .values([obj])
    //   .execute();
  }

  // 删
  async deleteById(id: number): Promise<IResult> {
    let { data } = await this.findByRoleId(id);
    if (data) {
      let {
        raw: { affectedRows },
      } = await getConnection()
        .createQueryBuilder()
        .update(RoleEntity)
        .set({
          status: 1,
        })
        .where('roleId = :id', { id })
        .execute();
      if (affectedRows) {
        return {
          code: StatusCode.SUCCESS,
          msg: '删除成功',
        };
      } else {
        return {
          code: StatusCode.FAILED,
          msg: '删除失败,数据库层面,发生的可能性很小',
        };
      }
    } else {
      return {
        code: StatusCode.ROLE_NOT_EXISTS,
        msg: '角色不存在',
      };
    }
  }

  // 修改角色信息, 允许修改自己的角色名称, 但是不允许修改名称为已经存在的角色
  async modifyRoleById(
    id: number,
    data: UpdateRoleDto,
  ): Promise<UpdateResult | IResult> {
    const { roleName, roleDesc, createdByUserId, status } = data;
    console.log(roleName, roleDesc, createdByUserId, status);
    // 1. 查询当前被修改id对应的角色
    const currentRole = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.roleId = :id', { id })
      .getOne();
    if (!currentRole) {
      return {
        code: StatusCode.FAILED,
        msg: '角色不存在, 无法更新',
      };
    }
    // 2. 修改后的名称是否存在
    const roleInDB = await this.findByRoleName(roleName);
    // 3. 如果修改后的角色名称存在并且被修改的角色id和查到的id不一致,说明是两个角色,不被允许
    if (roleInDB && roleInDB.roleId !== currentRole.roleId) {
      return {
        code: StatusCode.FAILED,
        msg: '修改后角色名称已存在,请换一个角色名称',
      };
    } else {
      let {
        raw: { affectedRows },
      } = await getConnection()
        .createQueryBuilder()
        .update(RoleEntity)
        .set({
          roleName: roleName || currentRole.roleName,
          roleDesc: roleDesc || currentRole.roleDesc,
          status: status || currentRole.status,
          createdByUserId,
          updateTime: new Date(),
        })
        .where('roleId = :id', { id })
        .execute();
      if (affectedRows) {
        return {
          code: StatusCode.SUCCESS,
          msg: '修改角色信息成功',
        };
      } else {
        return {
          code: StatusCode.FAILED,
          msg: '修改角色失败',
        };
      }
    }
  }

  // 查
  async findByRoleId(id: number) {
    let data = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.roleId = :id', { id })
      .printSql()
      .getOne();
    if (data) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '查询数据成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        msg: '角色不存在',
      };
    }
  }

  // 根据角色名称查询-精确匹配
  async findByRoleName(name: string): Promise<any> {
    let data = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.roleName = :name', { name })
      .printSql()
      .getOne();
    if (data) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '查询成功',
      };
    } else {
      return {
        code: StatusCode.NOT_FOUND,
        msg: '查无数据',
      };
    }
  }

  // 根据角色名称模糊查询
  async findByRoleLikeName(name: string): Promise<any> {
    let data = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.roleName like :name', { name: '%' + name + '%' })
      .printSql()
      .getMany();
    if (data.length > 0) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '查询成功',
      };
    } else {
      return {
        code: StatusCode.NOT_FOUND,
        msg: '查无数据',
      };
    }
  }

  // 根据条件, 查询满足条件的所有数据, 并缓存数据30s
  async findRoleListCache(queryOptions): Promise<any> {
    let { status } = queryOptions;
    let data = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.status = :status', { status })
      .orderBy({ 'role.createTime': 'DESC' })
      .cache(60000)
      .printSql()
      .getMany();

    if (data.length > 0) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '查询成功',
      };
    } else {
      return {
        code: StatusCode.NOT_FOUND,
        msg: '查无数据',
      };
    }
  }

  // 分页查询
  async findRoleListPagination(queryOptions: QueryOptionsRoleDTO) {
    let {
      roleName,
      roleDesc,
      status = 0,
      pageSize = 10,
      pageNumber = 1,
    } = queryOptions;
    this.toolService.checkPaginationPage(pageSize, pageNumber);
    let data = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.status = :status', { status })
      // .andWhere('role.role_name like :role_name', {
      //   role_name: '%' + role_name + '%',
      // })
      .orderBy({ 'role.createTime': 'DESC' })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getMany();

    if (data.length > 0) {
      return {
        code: StatusCode.SUCCESS,
        data,
        msg: '查询数据成功',
      };
    } else {
      return {
        code: StatusCode.NOT_FOUND,
        msg: '查无数据',
      };
    }
  }

  // -------------------------- 将查询结果存入redis中进行缓存  --------------------------
  // async findAll(): Promise<RoleEntity[]> {
  //   let redisTemp = await this.redisCacheService.get('roleList');
  //   if (redisTemp) {
  //     return redisTemp;
  //   }
  //   // 使用redis缓存的方式
  //   const result = await this.roleRepository.find();
  //   this.redisCacheService.set('roleList', result);
  //   return result;
  // }
}
