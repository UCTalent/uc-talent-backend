import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data?: any;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Something went wrong',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'VALIDATION_ERROR',
  })
  errorCode?: string;

  @ApiProperty({
    description: 'Error details',
    example: ['email is required'],
  })
  errors?: string[];
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Has previous page',
    example: false,
  })
  hasPrev: boolean;
}

export class ListResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;
} 