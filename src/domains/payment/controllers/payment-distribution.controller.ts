import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from '@payment/services/payment.service';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { 
  PaymentDistributionResponseDto, 
  PaymentDistributionListResponseDto 
} from '@payment/dtos/payment-response.dto';

@ApiTags('payment-distributions')
@Controller('api/v1/payment-distributions')
export class PaymentDistributionController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get payment distribution by ID' })
  @ApiParam({
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment distribution found successfully',
    type: PaymentDistributionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment distribution not found',
  })
  async findById(@Param('id') id: string): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.findPaymentDistributionById(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  @Get('recipient/:recipientId')
  @ApiOperation({ summary: 'Get payment distributions by recipient ID' })
  @ApiParam({
    name: 'recipientId',
    description: 'Recipient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment distributions found successfully',
    type: PaymentDistributionListResponseDto,
  })
  async findByRecipient(@Param('recipientId') recipientId: string): Promise<PaymentDistributionListResponseDto> {
    const paymentDistributions = await this.paymentService.findPaymentDistributionsByRecipient(recipientId);
    return {
      paymentDistributions: paymentDistributions.map(pd => this.mapToResponseDto(pd)),
      total: paymentDistributions.length,
      page: 1,
      limit: paymentDistributions.length,
    };
  }

  @Put(':id/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim payment distribution' })
  @ApiParam({
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment claimed successfully',
    type: PaymentDistributionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment distribution not found',
  })
  async claimPayment(@Param('id') id: string): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.claimPayment(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  @Put(':id/mark-paid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark payment distribution as paid' })
  @ApiParam({
    name: 'id',
    description: 'Payment distribution ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment marked as paid successfully',
    type: PaymentDistributionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment distribution not found',
  })
  async markAsPaid(@Param('id') id: string): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.markAsPaid(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  private mapToResponseDto(paymentDistribution: PaymentDistribution): PaymentDistributionResponseDto {
    return {
      id: paymentDistribution.id,
      jobId: paymentDistribution.jobId,
      recipientType: paymentDistribution.recipientType,
      recipientId: paymentDistribution.recipientId,
      amountCents: paymentDistribution.amountCents,
      currency: paymentDistribution.currency,
      status: paymentDistribution.status,
      claimedAt: paymentDistribution.claimedAt,
      paidAt: paymentDistribution.paidAt,
      createdAt: paymentDistribution.createdAt,
      updatedAt: paymentDistribution.updatedAt,
      deletedAt: paymentDistribution.deletedAt,
    };
  }
} 