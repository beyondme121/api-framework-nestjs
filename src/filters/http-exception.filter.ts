import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { formatDate } from 'src/utils'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception.message
    Logger.log(exception, '错误提示')
    const errorResponse = {
      code: -100,
      status,
      result: {
        message,
        path: req.url,
        method: req.method,
        timestamp: formatDate(Date.now())
      }
    }
     // 打印日志
     Logger.error(
      `【${formatDate(Date.now())}】${req.method} ${req.url}`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );
    // 设置返回的状态码、请求头、发送错误信息给前端
    res.status(status);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(errorResponse);
  }
}
