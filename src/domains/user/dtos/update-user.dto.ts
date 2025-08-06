import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsDate } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Phone number country code',
    example: 'US',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumberCountry?: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Encrypted password (internal use)',
    example: 'hashed_password_string',
    required: false,
  })
  @IsOptional()
  @IsString()
  encryptedPassword?: string;

  @ApiProperty({
    description: 'Location city ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationCityId?: string;

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  @IsOptional()
  @IsString()
  refCode?: string;

  // Authentication properties
  @ApiProperty({
    description: 'Confirmation token',
    example: 'confirmation_token_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  confirmationToken?: string;

  @ApiProperty({
    description: 'Confirmation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  confirmedAt?: Date;

  @ApiProperty({
    description: 'Reset password token',
    example: 'reset_token_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({
    description: 'Reset password sent timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  resetPasswordSentAt?: Date;
} 