import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from 'src/utils/log4js';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const now = Date.now();
    return next.handle().pipe(
      map((data: any) => {
        const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        User: ${JSON.stringify(req.user)}
        Response data: ${JSON.stringify(data)}
        Cost Time: ${Date.now() - now}(ms)
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return {
          result: classToPlain(data),
          status: res.statusCode,
        };
      }),
    );
  }
}
