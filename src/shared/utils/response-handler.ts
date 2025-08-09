import { HttpStatus } from '@nestjs/common';
import {
  ErrorResponseDto,
  SuccessResponseDto,
} from '@shared/dtos/response.dto';

export class ResponseHandler {
  static success({
    data,
    statusCode = HttpStatus.OK,
    message = 'success',
  }: SuccessResponseDto) {
    return {
      statusCode,
      message,
      data,
    };
  }

  static error({
    errors,
    statusCode = HttpStatus.BAD_REQUEST,
    message = 'error',
    stack,
  }: ErrorResponseDto) {
    return {
      statusCode,
      message,
      errors,
      stack: this.formatStack(stack),
    };
  }

  private static formatStack(stack?: string) {
    return stack
      ? stack
          .split('\n')
          .slice(1)
          .map(line => line.trim())
      : undefined;
  }
}
