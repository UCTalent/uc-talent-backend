import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Tech Corp' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Organization website',
    example: 'https://techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({
    description: 'Contact phone',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Organization type',
    example: 'company',
    required: false,
  })
  @IsOptional()
  @IsString()
  orgType?: string;

  @ApiProperty({
    description: 'About organization',
    example: 'Leading technology company...',
    required: false,
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    description: 'Foundation date',
    example: '2020-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  foundDate?: string;

  @ApiProperty({
    description: 'Organization size',
    example: 'large',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    description: 'Organization address',
    example: '123 Tech Street, Silicon Valley',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

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
  industryId?: string;

  @ApiProperty({
    description: 'City ID',
    example: 'city-uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiProperty({
    description: 'Country ID',
    example: 'country-uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiProperty({ description: 'Social links', required: false })
  @IsOptional()
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
