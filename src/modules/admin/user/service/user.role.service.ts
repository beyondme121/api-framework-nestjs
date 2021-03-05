import { RoleService } from '../../role/role.service';
import { RoleEntity } from '../../role/entities/role.entity';
import { StatusCode } from '../../../../config/constants';
import { AssignRoleDTO } from '../dto/user/user.assign_role.dto';
import { UserRoleEntity } from '../entities/role/user-role.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, EntityManager } from 'typeorm';
import { Logger } from '@src/utils';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly roleService: RoleService,
  ) {}

  // 给用户授予角色
  /**
   * TODO
   * 1. 登录用户是否有权限给某个用户授予权限
   * 2. 授予角色的这个用户是否存在
   * 3. 授予的角色是否存在并且有效
   */
  async assignRole(data: AssignRoleDTO) {
    /**
     * 1. 删除userId对应的角色
     * 2. 重新插入数据
     * 3. 启用事务
     */
    const { userId, roleList } = data;
    return getConnection()
      .transaction(async (entityManager: EntityManager) => {
        await entityManager.delete(UserRoleEntity, { userId });
        for (const item of roleList) {
          await entityManager.save(UserRoleEntity, { userId, roleId: item });
        }
      })
      .then(async () => {
        return {
          code: StatusCode.SUCCESS,
          msg: '添加角色成功',
        };
      })
      .catch((err) => {
        Logger.error('用户分配角色错误', err);
        throw new HttpException('用户分配角色错误', HttpStatus.BAD_REQUEST);
      });
  }

  /**
   * description: 根据用户id查询 用户对应的角色
   * @param userId
   */
  async getRoleInfoByUserId(userId: number): Promise<any> {
    // 从桥接表中获取用户的角色列表id
    const alreadyRoleList = await this.userRoleRepository.find({
      where: { userId },
      select: ['roleId'],
    });
    const alreadyRoleIdMapArray = alreadyRoleList.map((item) => item.roleId);

    // 获取所有的角色 await this.roleRepository.find({ where: {isDel: 0}})
    const { data } = await this.roleService.findRoleListCache({ is_del: 0 });
    return data.map((item) => ({
      id: item.role_id,
      title: item.role_name,
      isAuthorized: alreadyRoleIdMapArray.includes(item.role_id) ? 1 : 0,
    }));
  }
}
