import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobReferral, JobReferralStatus } from '../../../domains/job/entities/job-referral.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class JobReferralRepository implements IBaseRepository<JobReferral> {
  constructor(
    @InjectRepository(JobReferral)
    private readonly repository: Repository<JobReferral>,
  ) {}

  async findById(id: string): Promise<JobReferral | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<JobReferral[]> {
    return this.repository.find();
  }

  async create(data: Partial<JobReferral>): Promise<JobReferral> {
    const jobReferral = this.repository.create(data);
    return this.repository.save(jobReferral);
  }

  async update(id: string, data: Partial<JobReferral>): Promise<JobReferral> {
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

  async findByJob(jobId: string): Promise<JobReferral[]> {
    return this.repository.find({
      where: { jobId },
      relations: ['job', 'referrer']
    });
  }

  async findByReferrer(referrerId: string): Promise<JobReferral[]> {
    return this.repository.find({
      where: { referrerId },
      relations: ['job', 'job.organization']
    });
  }

  async findByStatus(status: string): Promise<JobReferral[]> {
    return this.repository.find({
      where: { status: status as JobReferralStatus },
      relations: ['job', 'referrer']
    });
  }

  async findByCandidateEmail(email: string): Promise<JobReferral[]> {
    return this.repository.find({
      where: { candidateEmail: email },
      relations: ['job', 'referrer']
    });
  }

  async findWithFilters(filters: any): Promise<[JobReferral[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('jobReferral')
      .leftJoinAndSelect('jobReferral.job', 'job')
      .leftJoinAndSelect('jobReferral.referrer', 'referrer');

    if (filters.status) {
      queryBuilder.andWhere('jobReferral.status = :status', { status: filters.status });
    }

    if (filters.jobId) {
      queryBuilder.andWhere('jobReferral.jobId = :jobId', { jobId: filters.jobId });
    }

    if (filters.referrerId) {
      queryBuilder.andWhere('jobReferral.referrerId = :referrerId', { referrerId: filters.referrerId });
    }

    if (filters.candidateEmail) {
      queryBuilder.andWhere('jobReferral.candidateEmail = :candidateEmail', { candidateEmail: filters.candidateEmail });
    }

    return queryBuilder.getManyAndCount();
  }
} 