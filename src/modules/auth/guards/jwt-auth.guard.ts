import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// 创建自己的类
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
