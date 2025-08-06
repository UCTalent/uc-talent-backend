import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class PaymentDistributionRepository implements IBaseRepository<PaymentDistribution> {
  constructor(
    @InjectRepository(PaymentDistribution)
    private readonly repository: Repository<PaymentDistribution>,
  ) {}

  async findById(id: string): Promise<PaymentDistribution | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['recipient', 'job'],
    });
  }

  async findAll(): Promise<PaymentDistribution[]> {
    return this.repository.find({
      relations: ['recipient', 'job'],
    });
  }

  async create(data: Partial<PaymentDistribution>): Promise<PaymentDistribution> {
    const payment = this.repository.create(data);
    return this.repository.save(payment);
  }

  async update(id: string, data: Partial<PaymentDistribution>): Promise<PaymentDistribution> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async findByRecipientId(recipientId: string): Promise<PaymentDistribution[]> {
    return this.repository.find({
      where: { recipientId },
      relations: ['job'],
    });
  }

  async findOne(options: any): Promise<PaymentDistribution | null> {
    return this.repository.findOne(options);
  }
} 