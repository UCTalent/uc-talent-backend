import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUserQueryDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ description: 'Items per page', example: 20, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ description: 'Search term', example: 'john', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'User status', example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'User role', example: 'user', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Sort by field', example: 'createdAt', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', example: 'DESC', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: string;
} 