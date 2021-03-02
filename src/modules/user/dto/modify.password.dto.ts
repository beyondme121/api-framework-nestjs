import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyPasswordDTO {
  @ApiProperty({ required: true, description: '老密码' })
  @IsString({ message: '老密码不能为空' })
  @IsNotEmpty({ message: '老密码不能为空' })
  readonly password?: string;

  @ApiProperty({ required: true, description: '新密码' })
  @IsString({ message: '新密码必须为字符串类型' })
  @IsNotEmpty({ message: '新密码不能为空' })
  readonly newPassword?: string;
}
