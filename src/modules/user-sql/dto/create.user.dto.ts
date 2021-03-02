import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
// https://github.com/typestack/class-validator
export class CreateUserDto {
  @IsString({ message: '必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @MaxLength(14, {
    message: '密码最大长度是14位',
  })
  @MinLength(6, {
    message: '密码最小长度为6位',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  repassword: string;
}
