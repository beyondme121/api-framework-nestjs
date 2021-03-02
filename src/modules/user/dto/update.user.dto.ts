import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString({ message: '老密码不能为空' })
  readonly password?: string;

  @IsString({ message: '新密码必须为字符串类型' })
  readonly newPassword?: string;

  @IsString({ message: '是否删除字段必须是字符串类型' })
  readonly isDel?: string;
}
