import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminJobQueryDto {
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

  @ApiProperty({ description: 'Search term', example: 'developer', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Job status', example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Organization ID', example: 'org-uuid', required: false })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({ description: 'Speciality ID', example: 'spec-uuid', required: false })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({ description: 'Date from', example: '2024-01-01', required: false })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiProperty({ description: 'Date to', example: '2024-12-31', required: false })
  @IsOptional()
  @IsString()
  dateTo?: string;
} 