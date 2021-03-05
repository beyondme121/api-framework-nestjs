import { UserGroupEntity } from './entities/group/user-group.entity';
import { RedisUtilService } from '../../redis-utils/redis.service';
import { RoleService } from '../role/role.service';
import { RoleEntity } from '../role/entities/role.entity';
import { ToolService } from '../../../utils/tool.service';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user/user.entity';
import { UserRoleEntity } from './entities/role/user-role.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRoleController } from './controller/user-role.controller';
import { UserRoleService } from './service/user.role.service';
import { UserGroupController } from './controller/user-group.controller';
import { UserGroupService } from './service/user.group.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserGroupEntity,
      UserRoleEntity,
      RoleEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserRoleController, UserGroupController],
  providers: [
    UserService,
    UserGroupService,
    ToolService,
    UserRoleService,
    RoleService,
    RedisUtilService,
  ],
})
export class UserModule {}
