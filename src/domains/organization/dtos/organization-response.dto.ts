import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Organization ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Organization name', example: 'Tech Corp' })
  name: string;

  @ApiProperty({ description: 'Organization about', example: 'Leading technology company', required: false })
  about?: string;

  @ApiProperty({ description: 'Organization address', example: '123 Tech Street, Silicon Valley', required: false })
  address?: string;

  @ApiProperty({ description: 'Contact email', example: 'contact@techcorp.com', required: false })
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone', example: '+1234567890', required: false })
  contactPhone?: string;

  @ApiProperty({ description: 'Foundation date', example: '2020-01-15', required: false })
  foundDate?: Date;

  @ApiProperty({ description: 'Organization website', example: 'https://techcorp.com', required: false })
  website?: string;

  @ApiProperty({ description: 'GitHub URL', example: 'https://github.com/techcorp', required: false })
  github?: string;

  @ApiProperty({ description: 'LinkedIn URL', example: 'https://linkedin.com/company/techcorp', required: false })
  linkedin?: string;

  @ApiProperty({ description: 'Twitter URL', example: 'https://twitter.com/techcorp', required: false })
  twitter?: string;

  @ApiProperty({ description: 'Organization type', example: 'company', required: false })
  orgType?: string;

  @ApiProperty({ description: 'Organization size', example: 'large', required: false })
  size?: string;

  @ApiProperty({ description: 'Organization status', example: 'active', required: false })
  status?: string;

  @ApiProperty({ description: 'Logo information', required: false })
  logo?: {
    url?: string;
    filename?: string;
    size?: number;
    contentType?: string;
  };

  @ApiProperty({ description: 'Industry information', required: false })
  industry?: {
    id: string;
    name: string;
    description?: string;
  };

  @ApiProperty({ description: 'City information', required: false })
  city?: {
    id: string;
    name: string;
    state?: string;
  };

  @ApiProperty({ description: 'Country information', required: false })
  country?: {
    id: string;
    name: string;
    code?: string;
  };

  @ApiProperty({ description: 'Jobs count', example: 15, required: false })
  jobsCount?: number;

  @ApiProperty({ description: 'Active jobs count', example: 8, required: false })
  activeJobsCount?: number;

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