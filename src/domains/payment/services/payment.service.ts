import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { PaymentStatus } from '@payment/entities/payment-distribution.entity';
import { PaymentDistributionRepository } from '@payment/repositories/payment-distribution.repository';

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

  async claimPayment(id: string): Promise<PaymentDistribution> {
    const payment = await this.findPaymentDistributionById(id);
    
    if (payment.status !== PaymentStatus.PENDING) {
      throw new Error('Payment is not available for claiming');
    }
    
    payment.status = PaymentStatus.CLAIMED;
    payment.claimedAt = new Date();
    
    return this.paymentDistributionRepository.update(id, payment);
  }

  async markAsPaid(id: string): Promise<PaymentDistribution> {
    const payment = await this.findPaymentDistributionById(id);
    
    if (payment.status !== PaymentStatus.CLAIMED) {
      throw new Error('Payment must be claimed before being marked as paid');
    }
    
    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    
    return this.paymentDistributionRepository.update(id, payment);
  }
} 