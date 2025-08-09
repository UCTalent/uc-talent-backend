import { HttpException, HttpStatus } from '@nestjs/common';

export class APIError extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    name?: string,
  ) {
    super(
      {
        statusCode,
        message,
      },
      statusCode,
    );

    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}
