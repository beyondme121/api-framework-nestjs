import { CreateAccessDTO } from '../dto/create.access.dto';
import { RbacGuard } from 'src/guards/rbac.guard';
import { AccessService } from '../services/access.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('资源模块')
@ApiBearerAuth()
@UseGuards(RbacGuard)
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}
  /**
   * 1. 创建, 根据资源id删除,  根据资源id更新,
   */

  @Post()
  async createAccess(@Body() createAccessDto: CreateAccessDTO) {}
}
