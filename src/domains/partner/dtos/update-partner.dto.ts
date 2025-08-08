import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdatePartnerDto {
  @ApiProperty({
    description: 'Partner name',
    example: 'Tech Partner Solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Partner slug (unique identifier)',
    example: 'tech-partner-solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent partner',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;
}
