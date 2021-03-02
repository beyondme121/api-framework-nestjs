import { UpdateUserDTO } from './dto/update.user.dto';
import { LocalAuthGuard } from './../auth/guards/local-auth.guard';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './../auth/auth.service';
import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create.user.dto';
import { SkipAuth } from 'src/decorators/public.decorator';
import { UserEntity } from './entities/user.entity';

type result = {
  code: number;
  data?: object;
  msg: string;
};

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
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return await this.userService.create(createUserDTO);
  }

  // 登录
  @SkipAuth()
  @UseGuards(LocalAuthGuard) // 用户名密码验证
  @Post('login')
  async login(@Request() req, @Body() loginDTO: LoginDTO) {
    console.log('3. LocalAuthGuard守卫验证通过', loginDTO, req.user);
    return await this.authService.certificate(req.user);
  }

  // 根据用户id删除用户
  @SkipAuth()
  @Delete(':id')
  async deleteById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<result> {
    return await this.userService.deleteById(id);
  }

  // 修改
  @SkipAuth()
  @Put(':id')
  async modifyUserById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    return await this.userService.modifyUserById(id, data);
  }

  // 查询所有有效用户
  @SkipAuth()
  @Get()
  async userList(@Query() queryOption: { [propNames: string]: string }) {
    return await this.userService.userList(queryOption);
  }
}
