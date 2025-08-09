import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PrivacySettingsDto {
  @ApiProperty({
    description: 'Show LinkedIn profile on public profile',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showLinkedInProfile?: boolean;

  @ApiProperty({
    description: 'Show GitHub repositories on public profile',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showGitHubRepos?: boolean;

  @ApiProperty({
    description: 'Show social connections on public profile',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showSocialConnections?: boolean;

  @ApiProperty({
    description: 'Allow automatic profile synchronization',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowProfileSync?: boolean;

  @ApiProperty({
    description: 'List of social links to show publicly',
    example: ['linkedin', 'github'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publicSocialLinks?: string[];
}

export class SyncSettingsDto {
  @ApiProperty({
    description: 'Enable automatic synchronization',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  autoSync?: boolean;

  @ApiProperty({
    description: 'Synchronization frequency',
    example: 'daily',
    enum: ['daily', 'weekly', 'monthly'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['daily', 'weekly', 'monthly'])
  syncFrequency?: string;

  @ApiProperty({
    description: 'Fields to synchronize',
    example: ['profile', 'connections', 'repos'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  syncFields?: string[];
}

export class SocialSettingsDto {
  @ApiProperty({
    description: 'Privacy settings',
    type: PrivacySettingsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  @ApiProperty({
    description: 'Synchronization settings',
    type: SyncSettingsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SyncSettingsDto)
  syncSettings?: SyncSettingsDto;
}
