import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errors: unknown = null,
  ) {
    super(
      {
        success: false,
        message,
        errors,
      },
      statusCode,
    );
  }
}