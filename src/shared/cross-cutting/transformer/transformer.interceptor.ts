import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

import { SuccessResponseDto } from '@/shared/dtos/response.dto';
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

          const isDev = process.env.NODE_ENV; // process.env.NODE_ENV === 'development';

          return ResponseHandler.error({
            statusCode: errorStatusCode,
            message: data.message,
            stack: isDev ? data.stack : undefined, // return stack only in development
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
      }),
    );
  }
}
