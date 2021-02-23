import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    return next.handle().pipe(
      map((data: any) => {
        return {
          result: classToPlain(data),
          // code: 0,
          // message: '请求成功',
          status: res.statusCode
        }
      })
    )
  }
}
