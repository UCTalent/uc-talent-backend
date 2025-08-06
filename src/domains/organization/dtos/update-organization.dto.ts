import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsUrl, IsDateString, IsUUID } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Updated Tech Corp', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Organization website', example: 'https://updatedtechcorp.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: 'Contact email', example: 'contact@updatedtechcorp.com', required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ description: 'Organization type', example: 'company', required: false })
  @IsOptional()
  @IsString()
  orgType?: string;

  @ApiProperty({ description: 'About organization', example: 'Updated description...', required: false })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ description: 'Foundation date', example: '2020-01-15', required: false })
  @IsOptional()
  @IsDateString()
  foundDate?: string;

  @ApiProperty({ description: 'Organization size', example: 'large', required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ description: 'Organization address', example: 'Updated address...', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Organization status', example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Industry ID', example: 'industry-uuid', required: false })
  @IsOptional()
  @IsUUID()
  industryId?: string;

  @ApiProperty({ description: 'City ID', example: 'city-uuid', required: false })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiProperty({ description: 'Country ID', example: 'country-uuid', required: false })
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