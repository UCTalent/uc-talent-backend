import { HttpStatus } from '@nestjs/common';

import {
  type ErrorResponse,
  type SuccessResponse,
} from '@shared/schemas/response';

export class ResponseHandler {
  static success({
    data,
    statusCode = HttpStatus.OK,
    message = 'success',
  }: SuccessResponse) {
    return {
      status_code: statusCode,
      message,
      data,
    };
  }

  static error({
    errors,
    statusCode = HttpStatus.BAD_REQUEST,
    message = 'error',
    stack,
  }: ErrorResponse) {
    return {
      status_code: statusCode,
      message,
      errors,
      stack: stack
        ? stack
            .split('\n')
            .slice(1)
            .map(line => line.trim())
        : undefined,
    };
  }
}
