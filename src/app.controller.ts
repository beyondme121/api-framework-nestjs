import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisUtilService } from './modules/redis-utils/redis.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new HttpException({ message: '获取数据错误', code: 2000 }, HttpStatus.BAD_REQUEST);
    return this.appService.getHello();
  }

  @Get('redis-test')
  async setKeyToRedisTest(): Promise<any> {
    console.log('redis-test');
    // await this.redisService.set('hello', 'world');
  }
}
