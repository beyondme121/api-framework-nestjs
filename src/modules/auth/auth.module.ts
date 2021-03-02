import { UserEntity } from './../user/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from 'src/config/constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from './../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RedisUtilModule } from './../redis-utils/redis.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // 默认策略
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '8h' },
    }),
    forwardRef(() => UserModule),
    // RedisUtilModule,
    TypeOrmModule.forFeature([UserEntity]), // 为什么要加入这个User实体???
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // 全局认证,可以写在任意的模块中
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
