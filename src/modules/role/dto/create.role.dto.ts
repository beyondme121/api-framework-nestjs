import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  role_name: string;
}