import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserGroupDTO {
  @IsString({ message: '用户组名必须为字符类型' })
  @IsNotEmpty({ message: '用户组名不能为空' })
  userGroupName: string;

  @IsString({ message: '用户组中文名必须为字符类型' })
  @IsNotEmpty({ message: '用户组中文名不能为空' })
  userGroupNameEN: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  parentId: number;
}
