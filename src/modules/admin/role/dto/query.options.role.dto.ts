import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QueryOptionsRoleDTO {
  @ApiProperty({ required: true, description: '角色名称' })
  role_name: string;

  @ApiProperty({ required: false, description: '角色描述' })
  role_desc: string;

  @ApiProperty({ required: false, description: '是否删除', enum: [0, 1] })
  @IsEnum({ 当前可用: 0, 禁用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  is_del: number;

  @ApiProperty({ required: false, description: '分页每一页的记录数' })
  pageSize: number;

  @ApiProperty({ required: false, description: '分页中的第几页' })
  pageNumber: number;
}