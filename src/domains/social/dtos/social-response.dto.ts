import { ApiProperty } from '@nestjs/swagger';

export class SocialAccountResponseDto {
  @ApiProperty({
    description: 'Social account ID',
    example: 'uuid-social-account-id',
  })
  id: string;

  @ApiProperty({
    description: 'Social provider',
    example: 'linkedin',
  })
  provider: string;

  @ApiProperty({
    description: 'Provider user ID',
    example: 'linkedin-user-123',
  })
  uid: string;

  @ApiProperty({
    description: 'Account status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Last synchronization date',
    example: '2024-01-20T10:00:00Z',
  })
  lastSyncedAt: Date;

  @ApiProperty({
    description: 'Token expiration date',
    example: '2024-12-31T23:59:59Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Social account metadata',
    example: {
      displayName: 'John Doe',
      email: 'john@example.com',
      profileUrl: 'https://linkedin.com/in/johndoe',
    },
  })
  metadata: any;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-20T10:00:00Z',
  })
  updatedAt: Date;
}

export class SocialSettingsResponseDto {
  @ApiProperty({
    description: 'Privacy settings',
  })
  privacySettings: {
    showLinkedInProfile: boolean;
    showGitHubRepos: boolean;
    showSocialConnections: boolean;
    allowProfileSync: boolean;
    publicSocialLinks: string[];
  };

  @ApiProperty({
    description: 'Synchronization settings',
  })
  syncSettings: {
    autoSync: boolean;
    syncFrequency: string;
    syncFields: string[];
  };

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-20T10:00:00Z',
  })
  updatedAt: Date;
}

export class SocialProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-user-id',
  })
  userId: string;

  @ApiProperty({
    description: 'User information',
  })
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Social accounts',
    type: [SocialAccountResponseDto],
  })
  socialAccounts: SocialAccountResponseDto[];
}

export class SyncResultResponseDto {
  @ApiProperty({
    description: 'Social account ID',
    example: 'uuid-social-account-id',
  })
  socialAccountId: string;

  @ApiProperty({
    description: 'Social provider',
    example: 'linkedin',
  })
  provider: string;

  @ApiProperty({
    description: 'Sync status',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Sync date',
    example: '2024-01-20T10:00:00Z',
  })
  syncedAt: Date;

  @ApiProperty({
    description: 'Number of changes',
    example: 2,
  })
  changesCount: number;

  @ApiProperty({
    description: 'Error message if failed',
    required: false,
  })
  error?: string;
}