import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
/**
 * 用户组更新DTO
 */
export class UpdateUserGroupDTO {
  // @IsNumber()
  // @Transform(({ value }) => parseInt(value, 10))
  status?: number;

  // @IsNumber()
  // @Transform(({ value }) => parseInt(value, 10))
  parentId?: number;
}
