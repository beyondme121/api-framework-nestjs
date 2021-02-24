import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { formatDate } from 'src/utils';
import { Request, Response } from 'express';
import { Logger } from '../utils/log4js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);
    response.status(status).json({
      statusCode: status,
      error: exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
    });
    // const message = exception.message;
    // const errorResponse = {
    //   code: -100,
    //   status,
    //   result: {
    //     message,
    //     path: req.url,
    //     method: req.method,
    //     timestamp: formatDate(Date.now()),
    //   },
    // };
    // // 打印日志
    // Logger.error(
    //   `【${formatDate(Date.now())}】${req.method} ${req.url}`,
    //   JSON.stringify(errorResponse),
    //   'HttpExceptionFilter',
    // );
    // // 设置返回的状态码、请求头、发送错误信息给前端
    // res.status(status);
    // res.header('Content-Type', 'application/json; charset=utf-8');
    // res.send(errorResponse);
  }
}
