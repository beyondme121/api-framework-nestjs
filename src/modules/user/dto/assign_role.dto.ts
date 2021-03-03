// 给用户添加角色

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignRoleDTO {
  @ApiProperty({ required: true, description: '用户id' })
  @IsInt({ message: '用户id必须是整数' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({ message: '用户userId不能为空' })
  readonly userId: number;

  @ApiProperty({ required: true, description: '角色id列表' })
  @IsArray({ message: '必须是角色id列表数组' })
  readonly roleList: number[];
}
