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
  @Get('list')
  async findAll(): Promise<any> {
    return this.roleService.findAll();
  }
}
