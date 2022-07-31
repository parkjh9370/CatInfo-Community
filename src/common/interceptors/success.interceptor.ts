import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 요청 수행 후 보내주는 응답 형태
    // 응답해야 할 data를 전달받아 해당 형태로 응답을 처리해준다..
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data,
      })),
    );
  }
}

// intercept
// 내부 코드 : pre-contorller
// return : post-request
