import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorName = exception.name;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
        const res = exceptionResponse as Record<string, any>;
        message = res.message || message;
        errorName = res.error || errorName;
      }
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as any).code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate value found';
    }

    response.status(status).json({
      message,
      error: errorName,
      statusCode: status,
    });
  }
}
