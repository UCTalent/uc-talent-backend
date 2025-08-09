import type { ValidationError } from '@nestjs/common';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe as DefaultValidationPipe,
} from '@nestjs/common';

import { ResponseHandler } from '@shared/utils/response-handler';

export class ValidationPipe extends DefaultValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatErrors = (errs: ValidationError[]) => {
          return errs.map((error) => ({
            [error.property]: error.children?.length
              ? formatErrors(error.children)
              : error.constraints
                ? Object.values(error.constraints)
                : null,
          }));
        };

        return new BadRequestException(
          ResponseHandler.error({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: formatErrors(errors),
          })
        );
      },
    });
  }
}
