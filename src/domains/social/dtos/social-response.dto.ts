import { ApiProperty } from '@nestjs/swagger';

export class SocialAccountResponseDto {
  @ApiProperty({ description: 'Social account ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Provider', example: 'google' })
  provider: string;

  @ApiProperty({ description: 'UID', example: '123456789' })
  uid: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Name', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'Avatar', example: 'https://example.com/avatar.jpg', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Social account created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Social account updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Social account deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class ExternalLinkResponseDto {
  @ApiProperty({
    description: 'External link ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Link title',
    example: 'My Portfolio',
  })
  title: string;

  @ApiProperty({
    description: 'Link URL',
    example: 'https://example.com',
  })
  url: string;

  @ApiProperty({
    description: 'Link description',
    example: 'My personal portfolio website',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Link icon',
    example: 'fas fa-globe',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: 'Link status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Link order',
    example: 1,
    required: false,
  })
  order?: number;

  @ApiProperty({
    description: 'External link created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'External link updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'External link deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class SocialAccountListResponseDto {
  @ApiProperty({ description: 'List of social accounts', type: [SocialAccountResponseDto] })
  socialAccounts: SocialAccountResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}

export class ExternalLinkListResponseDto {
  @ApiProperty({
    description: 'List of external links',
    type: [ExternalLinkResponseDto],
  })
  externalLinks: ExternalLinkResponseDto[];

  @ApiProperty({
    description: 'Total count',
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
} 