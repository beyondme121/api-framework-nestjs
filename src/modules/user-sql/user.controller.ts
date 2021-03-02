import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// 管道
import { UserByIdPipe } from 'src/pipes/user-by-id.pipe';
import { ValidationPipe } from '../../pipes/validation.pipe';
// dto
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { SkipAuth } from 'src/decorators/public.decorator';

@UsePipes(ValidationPipe) // 控制器级别
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 用户注册
  @SkipAuth()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  // 登录
  @SkipAuth()
  @UseGuards(LocalAuthGuard) // 启用用户名密码验证策略,passport会自己调用local.strategy中的validate方法
  @Post('login')
  async login(
    @Request() req,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<any> {
    return this.authService.certificate(req.user.data);
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

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll(@Request() req) {
    return await this.userService.findAll();
  }
}
