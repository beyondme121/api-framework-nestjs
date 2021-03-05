import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccessDTO } from './access.dto';

export class CreateAccessDTO extends AccessDTO {
  @ApiPropertyOptional({
    required: true,
    description: '节点类型: 顶级模块: 1; 表示菜单: 2; 操作: 3',
    enum: [1, 2, 3],
  })
  @IsEnum(
    { 顶级模块: 1, 表示菜单: 2, 操作: 3 },
    { message: '必须是1、2、3其中一个' },
  )
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({ message: '节点类型不能为空' })
  readonly type: number;
}
