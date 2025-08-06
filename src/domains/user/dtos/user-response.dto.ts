import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Phone number country code',
    example: 'US',
    required: false,
  })
  phoneNumberCountry?: string;

  @ApiProperty({
    description: 'Firebase UID',
    required: false,
  })
  firebaseUid?: string;

  @ApiProperty({
    description: 'Firebase provider',
    required: false,
  })
  firebaseProvider?: string;

  @ApiProperty({
    description: 'ThirdWeb metadata',
    required: false,
  })
  thirdwebMetadata?: Record<string, any>;

  @ApiProperty({
    description: 'Authentication providers',
    example: ['email', 'google'],
  })
  provider: string[];

  @ApiProperty({
    description: 'Provider UIDs',
    example: ['uid1', 'uid2'],
  })
  uid: string[];

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  refCode?: string;

  @ApiProperty({
    description: 'Location city ID',
    required: false,
  })
  locationCityId?: string;

  @ApiProperty({
    description: 'Whether user confirmed form',
    example: false,
  })
  isClickConfirmedForm: boolean;

  @ApiProperty({
    description: 'Confirmation token',
    required: false,
  })
  confirmationToken?: string;

  @ApiProperty({
    description: 'Confirmation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  confirmedAt?: Date;

  @ApiProperty({
    description: 'Reset password token',
    required: false,
  })
  resetPasswordToken?: string;

  @ApiProperty({
    description: 'Reset password sent timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  resetPasswordSentAt?: Date;

  @ApiProperty({
    description: 'User sign in count',
    example: 5,
  })
  signInCount: number;

  @ApiProperty({
    description: 'User current sign in at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  currentSignInAt?: Date;

  @ApiProperty({
    description: 'User current sign in IP',
    example: '192.168.1.1',
    required: false,
  })
  currentSignInIp?: string;

  @ApiProperty({
    description: 'User last sign in at',
    example: '2024-01-14T00:00:00.000Z',
    required: false,
  })
  lastSignInAt?: Date;

  @ApiProperty({
    description: 'User last sign in IP',
    example: '192.168.1.1',
    required: false,
  })
  lastSignInIp?: string;

  @ApiProperty({
    description: 'User failed attempts',
    example: 0,
  })
  failedAttempts: number;

  @ApiProperty({
    description: 'User locked at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  lockedAt?: Date;

  @ApiProperty({
    description: 'User unlock token',
    required: false,
  })
  unlockToken?: string;

  @ApiProperty({
    description: 'Remember me timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  rememberCreatedAt?: Date;

  @ApiProperty({
    description: 'Unconfirmed email',
    example: 'new.email@example.com',
    required: false,
  })
  unconfirmedEmail?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'User created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({
    description: 'Total count',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;
} 