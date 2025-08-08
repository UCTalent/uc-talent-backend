import { type HttpStatus } from '@nestjs/common';

export type SuccessResponse<TypeData = any> = {
  data: TypeData;
  statusCode?: HttpStatus;
  message?: string;
};

export type ErrorResponse<TypeData = any> = {
  errors?: TypeData;
  statusCode?: HttpStatus;
  message?: string;
  stack?: string;
};
