import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SkipAuth } from 'src/decorators/public.decorator';
import { RbacGuard } from 'src/guards/rbac.guard';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  // @SkipAuth()
  @UseGuards(RbacGuard)
  @Get()
  async findAll(): Promise<any> {
    console.log('role findall');
    return this.roleService.findAll();
  }

  // 测试缓存

  // async getRoleNameCache(@Query('key') key: string) {
  //   // const value = this.cacheManager.get(key);
  //   // console.log('cache key is ', key, ' value is ', value);
  //   // return value;
  // }

  // async setRoleNameCache(@Query() query: { [propNames: string]: string }) {
  //   let { key, value } = query;
  //   // await this.cacheManager.set(key, value, { ttl: 1000 }); // 1000秒 {ttl: null} 不设置过期时间
  // }
}
