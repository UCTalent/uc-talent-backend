import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class SocialAuthDto {
  @ApiProperty({
    description: 'OAuth authorization code',
    example: 'oauth-authorization-code-123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'CSRF state token',
    example: 'csrf-state-token-456',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'OAuth redirect URI',
    example: 'https://app.example.com/auth/callback',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  redirectUri?: string;
}
