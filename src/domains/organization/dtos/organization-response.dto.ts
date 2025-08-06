import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Organization ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Organization name', example: 'Tech Corp' })
  name: string;

  @ApiProperty({ description: 'Organization about', example: 'Leading technology company', required: false })
  about?: string;

  @ApiProperty({ description: 'Organization website', example: 'https://techcorp.com', required: false })
  website?: string;

  @ApiProperty({ description: 'GitHub URL', example: 'https://github.com/techcorp', required: false })
  github?: string;

  @ApiProperty({ description: 'LinkedIn URL', example: 'https://linkedin.com/company/techcorp', required: false })
  linkedin?: string;

  @ApiProperty({ description: 'Twitter URL', example: 'https://twitter.com/techcorp', required: false })
  twitter?: string;

  @ApiProperty({ description: 'Organization logo', example: 'https://techcorp.com/logo.png', required: false })
  logo?: string;

  @ApiProperty({ description: 'Industry ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  industryId?: string;

  @ApiProperty({ description: 'City ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  cityId?: string;

  @ApiProperty({ description: 'Country ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  countryId?: string;

  @ApiProperty({ description: 'Organization created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Organization updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Organization deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class OrganizationListResponseDto {
  @ApiProperty({ description: 'List of organizations', type: [OrganizationResponseDto] })
  organizations: OrganizationResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
} 