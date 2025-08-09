import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<TypeData = any> {
  @ApiProperty()
  data: TypeData;

  @ApiProperty({ required: false, enum: HttpStatus })
  statusCode?: HttpStatus;

  @ApiProperty({ required: false })
  message?: string;
}

export class ErrorResponseDto<TypeData = any> {
  @ApiProperty({ required: false })
  errors?: TypeData;

  @ApiProperty({ required: false, enum: HttpStatus })
  statusCode?: HttpStatus;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  stack?: string;
}
