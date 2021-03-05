import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AccessDTO } from './access.dto';

export class UpdateAccessDTO extends AccessDTO {
  @ApiPropertyOptional({
    required: false,
    description: '节点类型',
    enum: [1, 2, 3],
  })
  @IsEnum({ 顶级模块: 1, 菜单: 2, 操作: 3 })
  @IsInt({ message: '节点类型必须是数值' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  readonly type?: number; // 更新时, 可以不用传递节点类型
}
