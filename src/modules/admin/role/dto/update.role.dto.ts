import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    required: false,
    description: '角色名称,可以不填写,即:不修改角色名称',
  })
  @IsOptional()
  roleName?: string;

  @ApiProperty({ required: false, description: '角色描述' })
  @IsString({ message: '必须是字符串' })
  @IsOptional()
  roleDesc?: string;

  @ApiProperty({ required: false, description: '是否删除', enum: [0, 1] })
  @IsEnum({ 当前可用: 0, 禁用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  status?: number;

  @ApiProperty({ required: false, description: '修改人' })
  @IsOptional()
  createdByUserId?: number;
}
