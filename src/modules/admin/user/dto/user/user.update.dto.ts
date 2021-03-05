import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '办公地址' })
  address: string;

  @ApiProperty({ description: '手机号码' })
  mobile: string;

  @ApiProperty({ description: '用户类别' })
  type: string;
}
