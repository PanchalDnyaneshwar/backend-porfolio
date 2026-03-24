import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { buildResponse } from '../utils/response.util';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ReturnType<typeof buildResponse<T>>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ReturnType<typeof buildResponse<T>>> {
    return next.handle().pipe(
      map((response: any) => {
        if (response?.success !== undefined) {
          return response;
        }

        if (response?.message && response?.data !== undefined) {
          return buildResponse(response.message, response.data, response.meta);
        }

        return buildResponse('Request successful', response);
      }),
    );
  }
}
