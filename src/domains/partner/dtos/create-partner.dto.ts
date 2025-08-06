import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, Matches } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'Partner name',
    example: 'Tech Partner Solutions',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Partner slug (unique identifier)',
    example: 'tech-partner-solutions',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { 
    message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
  })
  slug: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent partner',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;
}