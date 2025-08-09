import { env } from '@/shared/infrastructure/env';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ResponseHandler } from '@shared/utils/response-handler';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const isLocal = env.NODE_ENV === 'local';

    if (exception instanceof BadRequestException) {
      return response.status(status).json(exception.getResponse());
    }

    const httpStatusName = Object.keys(HttpStatus).find(
      key => typeof HttpStatus[key] === 'number' && HttpStatus[key] === status,
    );

    return response.status(status).json(
      ResponseHandler.error({
        statusCode: status,
        errors: exception.name
          ? [exception.name, httpStatusName]
          : [httpStatusName],
        message: exception.message,
        stack: isLocal ? exception.stack : undefined,
      }),
    );
  }
}
