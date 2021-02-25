import { AuthService } from './../auth/auth.service';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// 管道
import { UserByIdPipe } from 'src/pipes/user-by-id.pipe';
import { ValidationPipe } from './../../pipes/validation.pipe';
// dto
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';

@UsePipes(ValidationPipe) // 控制器级别
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 用户注册
  // @UsePipes(ValidationPipe)
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  // 登录
  // @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() loginParams: LoginUserDto): Promise<any> {
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
    return {
      id: user.id,
      username: user.username,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }
}
