import { CreateRoleDto } from './dto/create.role.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { formatDate } from 'src/utils';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // 增
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 组织Role实体对应的数据
    const role = new Role();
    role.role_name = createRoleDto.role_name;
    role.is_active = '1';
    role.create_at = new Date();
    role.update_at = new Date();
    return await this.roleRepository.save(role);
  }

  // 删
  async delete(id: number): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }

  // 查
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}
