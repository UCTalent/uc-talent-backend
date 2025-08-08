import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsObject,
} from 'class-validator';

export class LinkSocialAccountDto {
  @ApiProperty({
    description: 'Social provider',
    example: 'linkedin',
    enum: [
      'facebook',
      'x',
      'twitter',
      'linkedin',
      'github',
      'instagram',
      'discord',
      'telegram',
    ],
  })
  @IsString()
  @IsIn([
    'facebook',
    'x',
    'twitter',
    'linkedin',
    'github',
    'instagram',
    'discord',
    'telegram',
  ])
  provider: string;

  @ApiProperty({
    description: 'Unique identifier from social provider',
    example: 'linkedin-user-123',
  })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    description: 'OAuth access token',
    example: 'oauth-access-token-123',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'OAuth refresh token',
    example: 'oauth-refresh-token-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({
    description: 'Token expiration date',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    description: 'Social account metadata',
    example: {
      displayName: 'John Doe',
      email: 'john@example.com',
      profileUrl: 'https://linkedin.com/in/johndoe',
      pictureUrl: 'https://media.licdn.com/dms/image/...',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
