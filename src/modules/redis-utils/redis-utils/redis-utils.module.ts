import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisUtilsService } from './redis-utils.service';

@Module({
  imports: [
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0
    })
  ],
  providers: [RedisUtilsService],
  exports: [
    RedisUtilsService
  ]
})
export class RedisUtilsModule {
}
