import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// 中间件
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

const HOST = process.env.HOST || 'locahost';
const PORT = process.env.PORT || 8080;
const PREFIX = process.env.PREFIX || '/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. 跨域
  app.enableCors();
  // 2. 通过设置请求提供安全保护
  app.use(helmet());
  // 3. 访问限制
  app.use(
    rateLimit({
      windowMS: 15 * 60 * 1000,
      max: 3, // limit each IP to 100 requests per windowMs
    }),
  );
  // 配置请求api前缀
  app.setGlobalPrefix(PREFIX);
  await app.listen(PORT, HOST, () => {});
  Logger.log(`server start at ${HOST}:${PORT}/${PREFIX}`);
}
bootstrap();
