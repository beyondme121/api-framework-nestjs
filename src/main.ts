import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// 中间件
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
// 拦截器
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validation/validation.pipe';

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
      windowMS: 5 * 60 * 1000,  // 5 min
      max: 300, // limit each IP to 300 requests per windowMs
    }),
  );
  // 配置请求api前缀
  app.setGlobalPrefix(PREFIX);
  // 全局注册拦截器 日志/响应数据格式化
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  // 全局注册HTTP异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 全局注册管道 参数校验
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT, HOST, () => {});
  Logger.log(`server start at ${HOST}:${PORT}/${PREFIX}`);
}
bootstrap();
