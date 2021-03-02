import { IResult } from '@src/types/result-type';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SkipAuth } from 'src/decorators/public.decorator';
import { RbacGuard } from 'src/guards/rbac.guard';
import { UpdateRoleDto } from './dto/update.role.dto';
import { UpdateResult } from 'typeorm';
import { ObjectType } from '@src/types';

@UseGuards(RbacGuard)
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  // 创建角色
  @Post()
  async create(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(req.user, createRoleDto);
  }

  // 删除
  @Delete(':id')
  async deleteById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.roleService.deleteById(id);
  }

  // 修改
  @Patch(':id')
  async modifyRoleById(
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UpdateResult | IResult> {
    let updateRoleObj = { createdByUserId: req.user.id, ...updateRoleDto };
    return this.roleService.modifyRoleById(id, updateRoleObj);
  }

  // 根据id查询角色
  @Get('byId')
  async findRoleById(@Query('id', new ParseIntPipe()) id: number) {
    return await this.roleService.findByRoleId(id);
  }

  // 根据名称查询角色
  @Get('byName')
  async findRoleByRoleName(@Query('role_name') role_name: string) {
    return await this.roleService.findByRoleName(role_name);
  }

  // 根据名称模糊查询角色
  @Get('byNameLike')
  async findRoleByRoleLikeName(@Query('role_name') role_name: string) {
    return await this.roleService.findByRoleLikeName(role_name);
  }

  // 根据条件查询所有角色,不分页, 并进行缓存
  @Get('all')
  async findAllRole(@Query() queryOptions: ObjectType): Promise<any> {
    console.log('queryOptions', queryOptions);
    return this.roleService.findRoleListCache(queryOptions);
  }

  // 根据条件查询所有角色,分页
}
