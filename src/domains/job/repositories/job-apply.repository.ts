import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApply, JobApplyStatus } from '../../../domains/job/entities/job-apply.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class JobApplyRepository implements IBaseRepository<JobApply> {
  constructor(
    @InjectRepository(JobApply)
    private readonly repository: Repository<JobApply>,
  ) {}

  async findById(id: string): Promise<JobApply | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<JobApply[]> {
    return this.repository.find();
  }

  async create(data: Partial<JobApply>): Promise<JobApply> {
    const jobApply = this.repository.create(data);
    return this.repository.save(jobApply);
  }

  async update(id: string, data: Partial<JobApply>): Promise<JobApply> {
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

  async findByJobAndTalent(jobId: string, talentId: string): Promise<JobApply | null> {
    return this.repository.findOne({
      where: { jobId, talentId },
      relations: ['job', 'talent', 'uploadedResume']
    });
  }

  async findByTalent(talentId: string): Promise<JobApply[]> {
    return this.repository.find({
      where: { talentId },
      relations: ['job', 'job.organization']
    });
  }

  async findByJob(jobId: string): Promise<JobApply[]> {
    return this.repository.find({
      where: { jobId },
      relations: ['talent', 'uploadedResume']
    });
  }

  async findByStatus(status: string): Promise<JobApply[]> {
    return this.repository.find({
      where: { status: status as JobApplyStatus },
      relations: ['job', 'talent']
    });
  }

  async findWithFilters(filters: any): Promise<[JobApply[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('jobApply')
      .leftJoinAndSelect('jobApply.job', 'job')
      .leftJoinAndSelect('jobApply.talent', 'talent')
      .leftJoinAndSelect('jobApply.uploadedResume', 'uploadedResume');

    if (filters.status) {
      queryBuilder.andWhere('jobApply.status = :status', { status: filters.status });
    }

    if (filters.jobId) {
      queryBuilder.andWhere('jobApply.jobId = :jobId', { jobId: filters.jobId });
    }

    if (filters.talentId) {
      queryBuilder.andWhere('jobApply.talentId = :talentId', { talentId: filters.talentId });
    }

    if (filters.jobStatus) {
      queryBuilder.andWhere('job.status = :jobStatus', { jobStatus: filters.jobStatus });
    }

    if (filters.jobNotStatus) {
      queryBuilder.andWhere('job.status != :jobNotStatus', { jobNotStatus: filters.jobNotStatus });
    }

    return queryBuilder.getManyAndCount();
  }
} 