import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisUtilService {
  public client: Redis;
  constructor(private redisService: RedisService) {}

  onModuleInit(): void {
    this.getClient();
  }

  public getClient(): void {
    this.client = this.redisService.getClient();
  }

  /**
   * @description: 设置redis存储
   * @param key
   * @param value
   * @param second
   */
  public async set(
    key: string,
    value: { [propsName: string]: any } | string,
    second?: number,
  ): Promise<void> {
    value = JSON.stringify(value);
    if (!second) {
      await this.client.setex(key, 24 * 60 * 60, value); // 秒为单位
    } else {
      await this.client.set(key, value, 'EX', second);
    }
  }

  /**
   * @description: 获取redis存储
   * @param key
   */
  public async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  public async del(key: string): Promise<any> {
    await this.client.del(key);
  }

  public async flushall(): Promise<any> {
    await this.client.flushall();
  }
}
