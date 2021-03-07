import { IResult } from '@src/types/result-type';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryOptionsRoleDTO } from './dto/query.options.role.dto';

@ApiTags('角色模块')
@ApiBearerAuth()
@UseGuards(RbacGuard)
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色', description: '输入角色名称' })
  @ApiCreatedResponse({
    type: CreateRoleDto,
    description: '创建角色DTO',
  })
  @Post()
  async create(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(req.user, createRoleDto);
  }

  @ApiOperation({ summary: '删除角色', description: '根据角色id删除角色' })
  @Delete(':id')
  async deleteById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.roleService.deleteById(id);
  }

  @ApiOperation({ summary: '修改角色信息', description: '根据角色id修改数据' })
  @ApiCreatedResponse({
    type: UpdateRoleDto,
    description: '修改角色信息, 角色名称不能是其他已经存在的角色名称',
  })
  @Patch(':id')
  async modifyRoleById(
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UpdateResult | IResult> {
    let updateRoleObj = { createdByUserId: req.user.id, ...updateRoleDto };
    return this.roleService.modifyRoleById(id, updateRoleObj);
  }

  @ApiOperation({
    summary: '查询某一个角色',
    description: '输入角色id或者uuid查询角色',
  })
  @Get('byId')
  async findRoleById(@Query('id', new ParseIntPipe()) id: number) {
    return await this.roleService.findByRoleId(id);
  }

  @ApiOperation({
    summary: '根据角色名称精确查询',
    description: '根据角色名称精确查询',
  })
  @Get('byName')
  async findRoleByRoleName(@Query('roleName') roleName: string) {
    return await this.roleService.findByRoleName(roleName);
  }

  @ApiOperation({
    summary: '根据名称模糊查询角色',
    description: '根据名称模糊查询角色',
  })
  @Get('byNameLike')
  async findRoleByRoleLikeName(@Query('roleName') roleName: string) {
    return await this.roleService.findByRoleLikeName(roleName);
  }

  // 根据条件查询所有角色,不分页, 并进行缓存
  @ApiOperation({
    summary: '根据条件查询所有角色',
    description:
      '根据条件查询所有角色,不分页, 并进行数据库缓存, 缓存表为query-result-cache',
  })
  @Get('all')
  async roleList(@Query() queryOptions: ObjectType): Promise<any> {
    console.log('queryOptions', queryOptions);
    return this.roleService.findRoleListCache(queryOptions);
  }

  // 根据条件查询所有角色,分页
  @ApiOperation({
    summary: '根据条件分页查询',
  })
  @Get('pagination')
  async roleListPagination(@Query() queryOptions: QueryOptionsRoleDTO) {
    return this.roleService.findRoleListPagination(queryOptions);
  }
}
