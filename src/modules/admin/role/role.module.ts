import { ToolService } from '../../../utils/tool.service';
// import { RedisUtilModule } from './../redis-utils/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleEntity } from './entities/role.entity';
import { RedisUtilService } from '../../redis-utils/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, RedisUtilService, ToolService],
  exports: [TypeOrmModule],
  // 如果模块之外使用RoleRepository存储库，则需要重新导出由其生成的提供程序
})
export class RoleModule {}
