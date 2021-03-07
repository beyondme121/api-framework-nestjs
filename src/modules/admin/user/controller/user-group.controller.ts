import { StatusCode } from './../../../../config/constants';
import { RbacGuard } from './../../../../guards/rbac.guard';
import { UserGroupEntity } from './../entities/group/user-group.entity';
import { CreateUserGroupDTO } from './../dto/group/group.create.dto';
import { UserGroupService } from './../service/user.group.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserGroupDTO } from '../dto/group/group.update.dto';
import { GroupUserIdsList } from '../types/user-module-types';

@UseGuards(RbacGuard)
@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Post()
  async create(@Body() data: CreateUserGroupDTO): Promise<UserGroupEntity> {
    return await this.userGroupService.create(data);
  }

  @Delete(':id')
  async deleteById(@Param('id', new ParseIntPipe()) id: number) {
    await this.userGroupService.deleteById(id);
    return {
      code: StatusCode.SUCCESS,
      msg: '删除用户组成功',
    };
  }

  @Patch(':id')
  async modifyById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUserGroupDTO,
  ) {
    return await this.userGroupService.modifyById(id, data);
  }

  @Get('listAll')
  async listAll() {
    return await this.userGroupService.listAll();
  }

  @Post('users')
  async addOrUpdateOrDeleteUsersToGroup(
    @Body() groupUserIdsList: GroupUserIdsList,
  ) {
    let { groupId, userIdsList } = groupUserIdsList;
    if (!groupId) {
      return {
        code: StatusCode.FAILED,
        msg: '用户组id必能为空',
      };
    }
    if (!userIdsList) {
      return {
        code: StatusCode.FAILED,
        msg: '没有传递userIdsList参数',
      };
    } else {
      return await this.userGroupService.addOrUpdateOrDeleteUsersToGroup(
        groupUserIdsList,
      );
    }
  }

  @UseGuards(RbacGuard)
  @Get('userId/:userId')
  async getUserInfoByGroupId(
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    return await this.userGroupService.getGroupListByUserId(userId);
  }
}
