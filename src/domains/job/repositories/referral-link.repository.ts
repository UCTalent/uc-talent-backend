import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferralLink } from '../../../domains/job/entities/referral-link.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class ReferralLinkRepository implements IBaseRepository<ReferralLink> {
  constructor(
    @InjectRepository(ReferralLink)
    private readonly repository: Repository<ReferralLink>,
  ) {}

  async findById(id: string): Promise<ReferralLink | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<ReferralLink[]> {
    return this.repository.find();
  }

  async create(data: Partial<ReferralLink>): Promise<ReferralLink> {
    const referralLink = this.repository.create(data);
    return this.repository.save(referralLink);
  }

  async update(id: string, data: Partial<ReferralLink>): Promise<ReferralLink> {
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

  async findByJobAndReferrer(
    jobId: string,
    referrerId: string,
  ): Promise<ReferralLink | null> {
    return this.repository.findOne({
      where: { jobId, referrerId },
      relations: ['job', 'referrer'],
    });
  }

  async findByJob(jobId: string): Promise<ReferralLink[]> {
    return this.repository.find({
      where: { jobId },
      relations: ['referrer'],
    });
  }

  async findByReferrer(referrerId: string): Promise<ReferralLink[]> {
    return this.repository.find({
      where: { referrerId },
      relations: ['job'],
    });
  }
}
