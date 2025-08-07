import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from '@payment/services/payment.service';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { 
  PaymentDistributionResponseDto, 
  PaymentDistributionListResponseDto 
} from '@payment/dtos/payment-response.dto';
import { ClaimPaymentDto } from '@payment/dtos/claim-payment.dto';
import { UpdateBlockchainStatusDto } from '@payment/dtos/update-blockchain-status.dto';
import { JwtAuthGuard } from '@shared/cross-cutting/authorization';
import { CurrentUser } from '@shared/cross-cutting/authorization';
import { User } from '@user/entities/user.entity';

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
  async claimPaymentById(@Param('id') id: string): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.claimPaymentById(id);
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

  @Post('claim')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment claimed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            claimed_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 422,
    description: 'Failed to claim payment',
  })
  async claimPayment(@Body() claimDto: ClaimPaymentDto, @CurrentUser() user: User) {
    return this.paymentService.claimPayment(claimDto, user.id);
  }

  @Patch('update_blockchain_status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update blockchain status' })
  @ApiResponse({
    status: 200,
    description: 'Blockchain status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            transaction_hash: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Payment distribution not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid status',
  })
  async updateBlockchainStatus(@Body() updateDto: UpdateBlockchainStatusDto) {
    return this.paymentService.updateBlockchainStatus(updateDto);
  }

  private mapToResponseDto(paymentDistribution: PaymentDistribution): PaymentDistributionResponseDto {
    return {
      id: paymentDistribution.id,
      amountCents: paymentDistribution.amountCents,
      amountCurrency: paymentDistribution.amountCurrency,
      claimedAt: paymentDistribution.claimedAt,
      notes: paymentDistribution.notes,
      paymentType: paymentDistribution.paymentType,
      percentage: paymentDistribution.percentage,
      recipientType: paymentDistribution.recipientType,
      recipientId: paymentDistribution.recipientId,
      role: paymentDistribution.role,
      status: paymentDistribution.status,
      transactionHash: paymentDistribution.transactionHash,
      jobId: paymentDistribution.jobId,
      createdAt: paymentDistribution.createdAt,
      updatedAt: paymentDistribution.updatedAt,
      deletedAt: paymentDistribution.deletedAt,
    };
  }
} 