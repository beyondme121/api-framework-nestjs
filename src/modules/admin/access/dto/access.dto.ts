import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class AccessDTO {
  @ApiPropertyOptional({ required: false, description: '模块名称' })
  @MaxLength(50, { message: '长度最大为50' })
  @IsOptional()
  moduleName?: string;

  @ApiPropertyOptional({ required: false, description: '操作名称' })
  @IsString({ message: '操作名称必须为字符串' })
  @IsOptional()
  actionName?: string;

  @ApiPropertyOptional({ required: false, description: '图标名称' })
  @IsString({ message: '图标必须为字符串' })
  @IsOptional()
  readonly icon?: string;

  @ApiPropertyOptional({ required: false, description: 'url地址' })
  // @IsUrl()
  @IsString({ message: 'url地址必须为字符串' })
  @IsOptional()
  readonly url?: string;

  @ApiPropertyOptional({ required: false, description: '请求方式' })
  @IsString({ message: 'method请求方式必须是字符类型' })
  @IsOptional()
  readonly method?: string;

  @ApiPropertyOptional({ required: false, description: '父节点模块id' })
  @IsInt({ message: '模块父节点必须是数字' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  readonly parentId?: number;

  @ApiPropertyOptional({ required: false, description: '平台名称' })
  @IsString({ message: '平台必须为字符串类型' })
  @IsOptional()
  readonly platform?: string;

  @ApiPropertyOptional({ required: false, description: '排序字段' })
  @IsInt({ message: '排序必须是数字' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  sort?: number;

  @ApiPropertyOptional({ required: false, description: '资源描述' })
  @IsString({ message: '资源描述必须是字符串' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    required: false,
    description: '资源状态',
    enum: [0, 1],
  })
  @IsEnum({ 当前可用: 0, 禁用: 1 }, { message: '必须是0或1' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  status?: number;
}
