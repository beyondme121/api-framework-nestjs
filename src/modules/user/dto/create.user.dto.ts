import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: '用户名必须为字符类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsString({ message: '密码必须为字符类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsString({ message: '密码必须为字符类型' })
  @IsNotEmpty({ message: '重复密码不能为空' })
  repassword: string;

  @IsString({ message: '用户中文名必须为字符类型' })
  username_cn: string;

  mobile: string;
  email: string;
  address: string;
  type: string;
}
