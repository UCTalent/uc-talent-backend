import { ApiProperty } from '@nestjs/swagger';

export class PaymentDistributionResponseDto {
  @ApiProperty({
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Amount in cents', example: 100000 })
  amountCents: number;

  @ApiProperty({ description: 'Amount currency', example: 'USDT' })
  amountCurrency: string;

  @ApiProperty({
    description: 'Claimed at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  claimedAt?: Date;

  @ApiProperty({
    description: 'Notes',
    example: 'Payment for successful referral',
    required: false,
  })
  notes?: string;

  @ApiProperty({ description: 'Payment type', example: 'referral_success' })
  paymentType: string;

  @ApiProperty({ description: 'Percentage', example: 10.5 })
  percentage: number;

  @ApiProperty({
    description: 'Recipient type',
    example: 'user',
    required: false,
  })
  recipientType?: string;

  @ApiProperty({
    description: 'Recipient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  recipientId?: string;

  @ApiProperty({ description: 'Role', example: 'referrer' })
  role: string;

  @ApiProperty({ description: 'Status', example: 'pending' })
  status: string;

  @ApiProperty({
    description: 'Transaction hash',
    example: '0xabc123...',
    required: false,
  })
  transactionHash?: string;

  @ApiProperty({
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobId: string;

  @ApiProperty({
    description: 'Payment distribution created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Payment distribution updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Payment distribution deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class PaymentDistributionListResponseDto {
  @ApiProperty({
    description: 'List of payment distributions',
    type: [PaymentDistributionResponseDto],
  })
  paymentDistributions: PaymentDistributionResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}

export class WalletAddressResponseDto {
  @ApiProperty({
    description: 'Wallet address ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({ description: 'Wallet address', example: '0x1234567890abcdef' })
  address: string;

  @ApiProperty({ description: 'Wallet type', example: 'ethereum' })
  type: string;

  @ApiProperty({
    description: 'Wallet address created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Wallet address updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Wallet address deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class WalletAddressListResponseDto {
  @ApiProperty({
    description: 'List of wallet addresses',
    type: [WalletAddressResponseDto],
  })
  walletAddresses: WalletAddressResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}
