import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisUtilsService } from './modules/redis-utils/redis-utils.service'
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisUtilsService
  ) {}

  @Get()
  getHello(): string {
    // throw new HttpException({ message: '获取数据错误', code: 2000 }, HttpStatus.BAD_REQUEST);
    return this.appService.getHello();
  }

  @Get('redis-test')
  async setKeyToRedisTest(): Promise<any> {
    await this.redisService.set('hello', 'world')
  }
}
