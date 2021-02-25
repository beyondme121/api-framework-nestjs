import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as express from 'express';

// 中间件
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
// 自定义中间件
import { logger } from './middlewares/logger.middleware';
// 自定义拦截器
import { TransformInterceptor } from './interceptors/transform.interceptor'; // 格式化响应 & 日志
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'; // 请求超时
// 自定义过滤器
import { HttpExceptionFilter } from './filters/http-exception.filter'; // HTTP异常过滤器
import { AllExceptionFilter } from './filters/all-exception.filter'; // 所有异常过滤器
// 管道
import { ValidationPipe } from './pipes/validation.pipe'; // 请求参数验证

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
      windowMS: 5 * 60 * 1000, // 5 min
      max: 300, // limit each IP to 300 requests per windowMs
    }),
  );
  // 4. 监听所有的请求路由，并打印日志 日志中间件 加上以下两句, 日志记录就会将post请求的参数记录下来
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(logger);

  // 5. 全局注册拦截器 日志/响应数据格式化
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  // 6. 全局注册HTTP异常过滤器 范围大的放在前面 ALL在前,HttpException在后,否则全被AllExceptionsFilter捕获了
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // 7. 配置请求api前缀
  app.setGlobalPrefix(PREFIX);

  // 8. 全局注册管道 参数校验
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, HOST, () => {});
  Logger.log(`server start at ${HOST}:${PORT}/${PREFIX}`);
}
bootstrap();
