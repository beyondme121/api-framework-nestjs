import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserByIdPipe } from 'src/pipes/user-by-id.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 用户注册
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  // 登录
  @Post('login')
  async login(@Body() loginParams: any): Promise<any> {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const result = await this.authService.validateUser(
      loginParams.username,
      loginParams.password,
    );
    // 根据用户的用户名密码验证结果执行不同的操作
    switch (result.code) {
      case 0:
        return this.authService.certificate(result.user);
      default:
        return result;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserByName(
    @Query('username') username: string,
  ): Promise<any | undefined> {
    return await this.userService.findOneUser(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('byid')
  async getUserById(@Query('id') id: string): Promise<any | undefined> {
    return await this.userService.findOneUserById(id);
  }

  // 验证自定义管道 根据用户名直接返回用户实体,根据客户端传递过来的name参数,
  // 通过管道, 查询数据库返回user对象
  // user: UserEntity
  @Get('getUserInfo')
  async getUserInfo(@Query('name', UserByIdPipe) user) {
    console.log('getUserInfo: ', user);
    return {
      id: user.id,
      username: user.username,
    };
  }
}
