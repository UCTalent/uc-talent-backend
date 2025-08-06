import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Not } from 'typeorm';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { PaymentDistributionRepository } from '@payment/repositories/payment-distribution.repository';
import { ClaimPaymentDto } from '@payment/dtos/claim-payment.dto';
import { UpdateBlockchainStatusDto } from '@payment/dtos/update-blockchain-status.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentDistributionRepository: PaymentDistributionRepository,
  ) {}

  async createPaymentDistribution(data: Partial<PaymentDistribution>): Promise<PaymentDistribution> {
    return this.paymentDistributionRepository.create(data);
  }

  async findPaymentDistributionById(id: string): Promise<PaymentDistribution> {
    const payment = await this.paymentDistributionRepository.findById(id);
    
    if (!payment) {
      throw new NotFoundException('Payment distribution not found');
    }
    
    return payment;
  }

  async findPaymentDistributionsByRecipient(recipientId: string): Promise<PaymentDistribution[]> {
    return this.paymentDistributionRepository.findByRecipientId(recipientId);
  }

  async claimPayment(claimDto: ClaimPaymentDto, userId: string) {
    // 1. Validate params
    if (!claimDto.payment_distributions.job_id) {
      throw new BadRequestException('job_id is required');
    }

    // 2. Find job (you'll need to inject JobRepository)
    // const job = await this.jobRepository.findOne({ where: { id: claimDto.payment_distributions.job_id } });
    // if (!job) throw new NotFoundException('Job not found');

    // 3. Find claimable payment distribution
    const paymentDist = await this.paymentDistributionRepository.findOne({
      where: {
        id: claimDto.payment_distributions.payment_distribution_id,
        jobId: claimDto.payment_distributions.job_id,
        recipientId: userId,
        status: 'pending',
        role: Not('platform_fee')
      }
    });
    
    if (!paymentDist) {
      throw new NotFoundException('Payment distribution not found or not claimable');
    }

    // 4. Validate role claim logic (candidate, referrer, hiring_manager)
    if (!this.validateRoleClaim(paymentDist, userId)) {
      throw new BadRequestException('Role not eligible to claim');
    }

    // 5. Update status
    paymentDist.status = 'completed';
    paymentDist.claimedAt = new Date();
    await this.paymentDistributionRepository.update(paymentDist.id, paymentDist);

    return {
      success: true,
      data: {
        id: paymentDist.id,
        status: paymentDist.status,
        claimed_at: paymentDist.claimedAt
      }
    };
  }

  async updateBlockchainStatus(updateDto: UpdateBlockchainStatusDto) {
    const paymentDist = await this.paymentDistributionRepository.findOne({
      where: { id: updateDto.payment_distribution_id }
    });
    
    if (!paymentDist) {
      throw new NotFoundException('Payment distribution not found');
    }

    if (updateDto.status !== 'completed') {
      throw new BadRequestException('Invalid status');
    }

    paymentDist.status = 'completed';
    paymentDist.transactionHash = updateDto.transaction_hash;
    await this.paymentDistributionRepository.update(paymentDist.id, paymentDist);

    return {
      success: true,
      data: {
        id: paymentDist.id,
        status: paymentDist.status,
        transaction_hash: paymentDist.transactionHash
      }
    };
  }

  private validateRoleClaim(paymentDist: PaymentDistribution, userId: string): boolean {
    // Implement logic to validate role claim
    // This should check job status, job_apply status, etc.
    // For now, return true as placeholder
    return true;
  }

  // Legacy methods for backward compatibility
  async claimPaymentById(id: string): Promise<PaymentDistribution> {
    const payment = await this.findPaymentDistributionById(id);
    
    if (payment.status !== 'pending') {
      throw new Error('Payment is not available for claiming');
    }
    
    payment.status = 'completed';
    payment.claimedAt = new Date();
    
    return this.paymentDistributionRepository.update(id, payment);
  }

  async markAsPaid(id: string): Promise<PaymentDistribution> {
    const payment = await this.findPaymentDistributionById(id);
    
    if (payment.status !== 'completed') {
      throw new Error('Payment must be completed before being marked as paid');
    }
    
    payment.status = 'paid';
    
    return this.paymentDistributionRepository.update(id, payment);
  }
} 