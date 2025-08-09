import type {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

type Response = {
  success: ApiResponseOptions[];
  error?: ApiResponseOptions[];
};

export type Document = {
  operation: ApiOperationOptions;
  responses: Response;
  query?: ApiQueryOptions;
  param?: ApiParamOptions;
  body?: ApiBodyOptions;
};
