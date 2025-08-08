import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class OrganizationQueryDto {
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

  @ApiProperty({ description: 'Search term', example: 'tech', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Organization status',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Industry ID',
    example: 'industry-uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  industry?: string;

  @ApiProperty({
    description: 'Country ID',
    example: 'country-uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  country?: string;

  @ApiProperty({
    description: 'City ID',
    example: 'city-uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  city?: string;

  @ApiProperty({
    description: 'Organization size',
    example: 'large',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    description: 'Organization type',
    example: 'company',
    required: false,
  })
  @IsOptional()
  @IsString()
  orgType?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: 'name',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', example: 'ASC', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
