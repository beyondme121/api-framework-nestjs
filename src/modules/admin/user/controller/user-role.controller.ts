import { RbacGuard } from '../../../../guards/rbac.guard';
import { AssignRoleDTO } from '../dto/user/user.assign_role.dto';
import { UserRoleService } from '../service/user.role.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

@UseGuards(RbacGuard)
@Controller('user_role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  // 给用户添加角色
  @Post()
  async assignRole(@Body() data: AssignRoleDTO) {
    return await this.userRoleService.assignRole(data);
  }

  // 查
  // 获取指定用户的所有角色
  @Get(':userId')
  async getRoleInfoByUserId(
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    return await this.userRoleService.getRoleInfoByUserId(userId);
  }
}
