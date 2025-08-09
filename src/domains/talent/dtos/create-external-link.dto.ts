import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateExternalLinkDto {
  @ApiProperty({ description: 'Link type (linkedin, github, portfolio, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Link URL' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Link title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Link description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
