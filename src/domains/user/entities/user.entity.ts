import { Entity, Column, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from '@talent/entities/talent.entity';
import { WalletAddress } from '@payment/entities/wallet-address.entity';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { Note } from '@notification/entities/note.entity';
import { SocialAccount } from '@social/entities/social-account.entity';
import { City } from '@location/entities/city.entity';

export enum UserProvider {
  EMAIL = 'email',
  FIREBASE = 'firebase',
  THIRDWEB = 'thirdweb',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  @Index()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Phone number country code',
    example: 'US',
    required: false,
  })
  @Column({ nullable: true })
  phoneNumberCountry: string;

  @ApiProperty({
    description: 'Encrypted password',
    example: 'hashed_password_string',
    required: false,
  })
  @Column({ nullable: true })
  encryptedPassword: string;

  @ApiProperty({
    description: 'Firebase UID',
    example: 'firebase_uid_123',
    required: false,
  })
  @Column({ nullable: true, unique: true })
  @Index()
  firebaseUid: string;

  @ApiProperty({
    description: 'Firebase provider',
    example: 'google',
    required: false,
  })
  @Column({ nullable: true })
  firebaseProvider: string;

  @ApiProperty({
    description: 'ThirdWeb metadata',
    example: { wallet: '0x123...' },
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  thirdwebMetadata: Record<string, any>;

  @ApiProperty({
    description: 'Authentication providers',
    example: ['email', 'google'],
    required: false,
  })
  @Column('text', { array: true, default: [] })
  provider: string[];

  @ApiProperty({
    description: 'Provider UIDs',
    example: ['uid1', 'uid2'],
    required: false,
  })
  @Column('text', { array: true, default: [] })
  uid: string[];

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  @Column({ nullable: true })
  refCode: string;

  @ApiProperty({
    description: 'Location city ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Column({ nullable: true })
  locationCityId: string;

  @ApiProperty({
    description: 'Whether user confirmed form',
    example: false,
  })
  @Column({ default: false })
  isClickConfirmedForm: boolean;

  @ApiProperty({
    description: 'Confirmation token',
    example: 'confirmation_token_123',
    required: false,
  })
  @Column({ nullable: true })
  confirmationToken: string;

  @ApiProperty({
    description: 'Confirmation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  confirmedAt: Date;

  @ApiProperty({
    description: 'Reset password token',
    example: 'reset_token_123',
    required: false,
  })
  @Column({ nullable: true })
  resetPasswordToken: string;

  @ApiProperty({
    description: 'Reset password sent timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  resetPasswordSentAt: Date;

  @ApiProperty({
    description: 'Sign in count',
    example: 5,
  })
  @Column({ default: 0 })
  signInCount: number;

  @ApiProperty({
    description: 'Current sign in timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  currentSignInAt: Date;

  @ApiProperty({
    description: 'Last sign in timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  lastSignInAt: Date;

  @ApiProperty({
    description: 'Current sign in IP',
    example: '192.168.1.1',
    required: false,
  })
  @Column({ nullable: true })
  currentSignInIp: string;

  @ApiProperty({
    description: 'Last sign in IP',
    example: '192.168.1.1',
    required: false,
  })
  @Column({ nullable: true })
  lastSignInIp: string;

  @ApiProperty({
    description: 'Account locked timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  lockedAt: Date;

  @ApiProperty({
    description: 'Unlock token',
    example: 'unlock_token_123',
    required: false,
  })
  @Column({ nullable: true })
  unlockToken: string;

  @ApiProperty({
    description: 'Failed login attempts',
    example: 0,
  })
  @Column({ default: 0 })
  failedAttempts: number;

  @ApiProperty({
    description: 'Remember me timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  rememberCreatedAt: Date;

  @ApiProperty({
    description: 'Unconfirmed email',
    example: 'new.email@example.com',
    required: false,
  })
  @Column({ nullable: true })
  unconfirmedEmail: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus;

  // Relationships
  @OneToMany(() => Talent, (talent) => talent.user)
  talents: Talent[];

  @OneToMany(() => WalletAddress, (wallet) => wallet.owner)
  walletAddresses: WalletAddress[];

  @OneToMany(() => PaymentDistribution, (payment) => payment.recipient)
  paymentDistributions: PaymentDistribution[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => SocialAccount, (social) => social.user)
  socialAccounts: SocialAccount[];

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'locationCityId' })
  locationCity: City;
} 