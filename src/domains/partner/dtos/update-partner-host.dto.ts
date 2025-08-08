import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdatePartnerHostDto {
  @ApiProperty({
    description: 'Host domain or URL',
    example: 'api.techpartner.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  host?: string;

  @ApiProperty({
    description: 'Host slug (unique identifier)',
    example: 'tech-partner-host',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent host',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;
}
