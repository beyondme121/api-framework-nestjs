import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ required: true, description: '角色名称' })
  @IsString({ message: '必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  role_name: string;

  @ApiProperty({ required: false, description: '角色描述' })
  @IsString({ message: '必须是字符串' })
  @IsNotEmpty({ message: '角色描述不能为空' })
  role_desc: string;

  @ApiProperty({ required: false, description: '是否删除', enum: [0, 1] })
  @IsEnum({ 当前可用: 0, 禁用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  is_del: number;

  @ApiProperty({ required: false, description: '修改人' })
  createdByUserId: number;
}
