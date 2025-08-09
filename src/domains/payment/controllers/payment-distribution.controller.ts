import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentService } from '@payment/services/payment.service';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import {
  PaymentDistributionResponseDto,
  PaymentDistributionListResponseDto,
} from '@payment/dtos/payment-response.dto';
import { ClaimPaymentDto } from '@payment/dtos/claim-payment.dto';
import { UpdateBlockchainStatusDto } from '@payment/dtos/update-blockchain-status.dto';
import { JwtAuthGuard } from '@shared/cross-cutting/authorization';
import { CurrentUser } from '@shared/cross-cutting/authorization';
import { Docs } from '@documents/payment/payment.document';
import { User } from '@user/entities/user.entity';

@ApiTags('payment-distributions')
@Controller('payment-distributions')
export class PaymentDistributionController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':id')
  @ApiOperation(Docs.getPaymentDistributionById.operation)
  @ApiParam(Docs.getPaymentDistributionById.param)
  @ApiResponse(Docs.getPaymentDistributionById.responses.success[0])
  @ApiResponse(Docs.getPaymentDistributionById.responses.error[0])
  async findById(
    @Param('id') id: string,
  ): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution =
      await this.paymentService.findPaymentDistributionById(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  @Get('recipient/:recipientId')
  @ApiOperation(Docs.getByRecipient.operation)
  @ApiParam(Docs.getByRecipient.param)
  @ApiResponse(Docs.getByRecipient.responses.success[0])
  async findByRecipient(
    @Param('recipientId') recipientId: string,
  ): Promise<PaymentDistributionListResponseDto> {
    const paymentDistributions =
      await this.paymentService.findPaymentDistributionsByRecipient(
        recipientId,
      );
    return {
      paymentDistributions: paymentDistributions.map(pd =>
        this.mapToResponseDto(pd),
      ),
      total: paymentDistributions.length,
      page: 1,
      limit: paymentDistributions.length,
    };
  }

  @Put(':id/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(Docs.claimPaymentById.operation)
  @ApiParam(Docs.claimPaymentById.param)
  @ApiResponse(Docs.claimPaymentById.responses.success[0])
  @ApiResponse(Docs.claimPaymentById.responses.error[0])
  async claimPaymentById(
    @Param('id') id: string,
  ): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.claimPaymentById(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  @Put(':id/mark-paid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(Docs.markAsPaid.operation)
  @ApiParam(Docs.markAsPaid.param)
  @ApiResponse(Docs.markAsPaid.responses.success[0])
  @ApiResponse(Docs.markAsPaid.responses.error[0])
  async markAsPaid(
    @Param('id') id: string,
  ): Promise<PaymentDistributionResponseDto> {
    const paymentDistribution = await this.paymentService.markAsPaid(id);
    return this.mapToResponseDto(paymentDistribution);
  }

  @Post('claim')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(Docs.claimPayment.operation)
  @ApiBody(Docs.claimPayment.body)
  @ApiResponse(Docs.claimPayment.responses.success[0])
  @ApiResponse(Docs.claimPayment.responses.error[0])
  async claimPayment(
    @Body() claimDto: ClaimPaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentService.claimPayment(claimDto, user.id);
  }

  @Patch('update_blockchain_status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(Docs.updateBlockchainStatus.operation)
  @ApiResponse(Docs.updateBlockchainStatus.responses.success[0])
  @ApiResponse(Docs.updateBlockchainStatus.responses.error[0])
  async updateBlockchainStatus(@Body() updateDto: UpdateBlockchainStatusDto) {
    return this.paymentService.updateBlockchainStatus(updateDto);
  }

  private mapToResponseDto(
    paymentDistribution: PaymentDistribution,
  ): PaymentDistributionResponseDto {
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
