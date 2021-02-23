import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString({ message: '必须是字符串'})
  @IsNotEmpty({ message: '用户名不能为空'})
  username: string;

  @IsNotEmpty({ message: '密码不能为空！！！'})
  password: string;

  @IsNotEmpty({ message: '确认密码不能为空'})
  repassword: string;
}