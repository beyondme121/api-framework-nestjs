import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }
}
