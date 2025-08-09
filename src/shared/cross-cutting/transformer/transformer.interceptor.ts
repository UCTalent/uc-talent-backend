import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { SuccessResponseDto } from '@/shared/dtos/response.dto';
import { env } from '@/shared/infrastructure/env';
import { ResponseHandler } from '@shared/utils/response-handler';

const NO_RETURN: SuccessResponseDto = {
  data: null,
  message: 'no return',
};

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();

    return next.handle().pipe(
      map((data: SuccessResponseDto) => {
        // case: no return
        if (!data) {
          return ResponseHandler.success(NO_RETURN);
        }

        // case: error
        if (data && data instanceof Error) {
          const errorStatusCode = data.statusCode || HttpStatus.BAD_REQUEST;
          response.status(errorStatusCode);

          const isLocal = env.NODE_ENV === 'local';

          return ResponseHandler.error({
            statusCode: errorStatusCode,
            message: data.message,
            stack: isLocal ? data.stack : undefined,
          });
        }

        // case: success without formation
        if (data && !data.data) {
          return ResponseHandler.success({
            statusCode: HttpStatus.OK,
            message: 'success',
            data,
          });
        }

        // case: success with formation
        const successStatusCode = data.statusCode || HttpStatus.OK;
        response.status(successStatusCode);
        return data;
      })
    );
  }
}
