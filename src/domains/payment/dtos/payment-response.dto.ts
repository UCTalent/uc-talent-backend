import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@payment/entities/payment-distribution.entity';

export class PaymentDistributionResponseDto {
  @ApiProperty({ description: 'Payment distribution ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Recipient type', example: 'user' })
  recipientType: string;

  @ApiProperty({ description: 'Recipient ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  recipientId: string;

  @ApiProperty({ description: 'Job ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  jobId?: string;

  @ApiProperty({ description: 'Amount in cents', example: 100000 })
  amountCents: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus, example: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ description: 'Claimed at', example: '2024-01-15T00:00:00.000Z', required: false })
  claimedAt?: Date;

  @ApiProperty({ description: 'Paid at', example: '2024-01-15T00:00:00.000Z', required: false })
  paidAt?: Date;

  @ApiProperty({ description: 'Payment distribution created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Payment distribution updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Payment distribution deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class PaymentDistributionListResponseDto {
  @ApiProperty({ description: 'List of payment distributions', type: [PaymentDistributionResponseDto] })
  paymentDistributions: PaymentDistributionResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}

export class WalletAddressResponseDto {
  @ApiProperty({ description: 'Wallet address ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Wallet address', example: '0x1234567890abcdef' })
  address: string;

  @ApiProperty({ description: 'Wallet type', example: 'ethereum' })
  type: string;

  @ApiProperty({ description: 'Wallet address created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Wallet address updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Wallet address deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class WalletAddressListResponseDto {
  @ApiProperty({ description: 'List of wallet addresses', type: [WalletAddressResponseDto] })
  walletAddresses: WalletAddressResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
} 