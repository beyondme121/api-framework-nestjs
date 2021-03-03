import { RedisUtilService } from './../redis-utils/redis.service';
import { RoleService } from './../role/role.service';
import { RoleEntity } from './../role/entities/role.entity';
import { ToolService } from './../../utils/tool.service';
import { AuthModule } from './../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRoleController } from './controller/user-role.controller';
import { UserRoleService } from './service/user.role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity, RoleEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserRoleController],
  providers: [
    UserService,
    ToolService,
    UserRoleService,
    RoleService,
    RedisUtilService,
  ],
})
export class UserModule {}
