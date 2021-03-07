import { RbacGuard } from './../../../../guards/rbac.guard';
import { StatusCode } from './../../../../config/constants';
import { UserGroupIdsList } from './../types/user-module-types';
import { ModifyPasswordDTO } from '../dto/user/user.modify.password.dto';
import { UpdateUserDTO } from '../dto/user/user.update.dto';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { LoginDTO } from '../dto/user/user.login.dto';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../dto/user/user.create.dto';
import { SkipAuth } from 'src/decorators/public.decorator';
import { UserEntity } from '../entities/user/user.entity';
import { ObjectType } from '@src/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('用户模块')
@ApiBearerAuth('jwt')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 创建用户(注册)
  // 跳过jwt验证, 用户注册不需要先验证jwt验证(针对普通用户来说, 不针对管理员场景)
  @SkipAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return await this.userService.create(createUserDTO);
  }

  // 登录
  @SkipAuth() // 跳过携带token, 登录前本来就没有token, 不需要认证
  @UseGuards(LocalAuthGuard) // 进行用户名密码验证
  @Post('login')
  async login(@Request() req, @Body() loginDTO: LoginDTO) {
    return await this.authService.certificate(req.user);
  }

  // 根据用户id删除用户
  @UseGuards(RbacGuard)
  @Delete(':id')
  async deleteById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ObjectType> {
    return await this.userService.deleteById(id);
  }

  // 修改 区别: Patch:更新部分数据, PUT:更新整条记录
  @UseGuards(RbacGuard)
  @Patch(':id')
  async modifyUserById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    return await this.userService.modifyUserById(id, data);
  }

  @UseGuards(RbacGuard)
  @Patch(':id')
  async modifyPassword(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: ModifyPasswordDTO,
  ) {
    return await this.userService.modifyPasswordById(id, data);
  }

  // 根据id查询用户
  @UseGuards(RbacGuard)
  @Get('userinfo/:id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserEntity> {
    return await this.userService.findOneById(id);
  }

  // 查询所有有效用户,单点登录, 校验请求携带的token和redis中的token是否一致
  @UseGuards(RbacGuard)
  @Get('list')
  async userList(@Query() queryOption: ObjectType) {
    return await this.userService.userList(queryOption);
  }

  @UseGuards(RbacGuard)
  @Post('groups')
  async addOrUpdateOrDeleteOneUserToGroupList(
    @Body() userGroupIdsList: UserGroupIdsList,
  ) {
    let { userId, groupIdsList } = userGroupIdsList;
    if (!userId) {
      return {
        code: StatusCode.FAILED,
        msg: '用户id必能为空',
      };
    }
    if (!groupIdsList) {
      return {
        code: StatusCode.FAILED,
        msg: '没有传递groupIdsList参数',
      };
    } else {
      return await this.userService.addOrUpdateOrDeleteOneUserToGroupList(
        userGroupIdsList,
      );
    }
  }

  // 根据用户组id查询当前用户组下的所有用户
  @UseGuards(RbacGuard)
  @Get('groupId/:groupId')
  async getUserInfoByGroupId(
    @Param('groupId', new ParseIntPipe()) groupId: number,
  ) {
    return await this.userService.getUserListByGroupId(groupId);
  }
}
