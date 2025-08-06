import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialSearchDto {
  @ApiProperty({
    description: 'Filter by social provider',
    example: 'linkedin',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Search query for display name, email, etc.',
    example: 'software engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({
    description: 'Filter by skills from social profiles',
    example: ['javascript', 'react', 'nodejs'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    description: 'Filter by location',
    example: 'San Francisco, CA',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Filter by industry (LinkedIn)',
    example: 'Computer Software',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}