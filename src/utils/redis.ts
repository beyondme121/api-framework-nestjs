import * as Redis from 'ioredis';
import { Logger } from '../utils/log4js';
import getConfig from '../config/db.config';

let config = getConfig(process.env.NODE_ENV);
let n: number = 0;
const redisIndex = []; // 用于记录 redis 实例索引
const redisList = []; // 用于存储 redis 实例

export class RedisInstance {
  static async initRedis(method: string, db: number = 0) {
    const isExist = redisIndex.some((x) => x === db);
    if (!isExist) {
      Logger.debug(
        `[Redis ${db}]来自 ${method} 方法调用, Redis 实例化了 ${++n} 次 `,
      );
      redisList[db] = new Redis({
        host: config.redis.host,
        port: config.redis.port as number,
        password: config.redis.password,
        db: config.redis.db as number,
      });
      redisIndex.push(db);
    } else {
      Logger.debug(`[Redis ${db}]来自 ${method} 方法调用`);
    }
    return redisList[db];
  }
}
