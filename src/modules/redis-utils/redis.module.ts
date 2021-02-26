import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisUtilService } from './redis.service';

@Module({
  imports: [
    RedisModule.register({
      port: 6379,
      host: 'localhost',
      password: '123456',
      db: 0,
    }),
  ],
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {}
