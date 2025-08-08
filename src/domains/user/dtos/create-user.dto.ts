import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
    description: 'Firebase UID',
    example: 'firebase_uid_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  firebaseUid?: string;

  @ApiProperty({
    description: 'Firebase provider',
    example: 'google',
    required: false,
  })
  @IsOptional()
  @IsString()
  firebaseProvider?: string;

  @ApiProperty({
    description: 'ThirdWeb metadata',
    example: { wallet: '0x123...' },
    required: false,
  })
  @IsOptional()
  thirdwebMetadata?: Record<string, any>;

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  @IsOptional()
  @IsString()
  refCode?: string;

  @ApiProperty({
    description: 'Location city ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationCityId?: string;
}
