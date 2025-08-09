import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Job, JobStatus } from '@job/entities/job.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class JobRepository implements IBaseRepository<Job> {
  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
  ) {}

  async findById(id: string): Promise<Job | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Job[]> {
    return this.repository.find();
  }

  async create(data: Partial<Job>): Promise<Job> {
    const job = this.repository.create(data);
    return this.repository.save(job);
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
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

  async findByStatus(status: JobStatus): Promise<Job[]> {
    return this.repository.find({
      where: { status },
      relations: ['organization', 'speciality', 'skills'],
    });
  }

  async findByOrganization(organizationId: string): Promise<Job[]> {
    return this.repository.find({
      where: { organizationId },
      relations: ['speciality', 'skills'],
    });
  }

  async findByPartnerHost(partnerHostId: string): Promise<Job[]> {
    return this.repository.find({
      where: { partnerHostId },
      relations: ['organization', 'speciality'],
    });
  }

  // New methods for admin service
  async findWithAdminFilters(options: {
    search?: string;
    status?: JobStatus;
    organization?: string;
    speciality?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<{ data: Job[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .leftJoinAndSelect('job.city', 'city')
      .leftJoinAndSelect('job.country', 'country');

    if (options.search) {
      queryBuilder.where('job.title ILIKE :search', {
        search: `%${options.search}%`,
      });
    }

    if (options.status) {
      queryBuilder.andWhere('job.status = :status', { status: options.status });
    }

    if (options.organization) {
      queryBuilder.andWhere('organization.id = :organization', {
        organization: options.organization,
      });
    }

    if (options.speciality) {
      queryBuilder.andWhere('speciality.id = :speciality', {
        speciality: options.speciality,
      });
    }

    if (options.dateFrom) {
      queryBuilder.andWhere('job.postedDate >= :dateFrom', {
        dateFrom: options.dateFrom,
      });
    }

    if (options.dateTo) {
      queryBuilder.andWhere('job.postedDate <= :dateTo', {
        dateTo: options.dateTo,
      });
    }

    if (options.sortBy) {
      queryBuilder.orderBy(
        `job.${options.sortBy}`,
        options.sortOrder || 'DESC',
      );
    } else {
      queryBuilder.orderBy('job.createdAt', 'DESC');
    }

    if (options.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options.take !== undefined) {
      queryBuilder.take(options.take);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findByIds(ids: string[]): Promise<Job[]> {
    return this.repository.find({
      where: { id: In(ids) },
      relations: ['organization', 'speciality'],
    });
  }

  async bulkUpdateStatus(ids: string[], status: JobStatus): Promise<void> {
    await this.repository.update(
      { id: In(ids) },
      { status, updatedAt: new Date() },
    );
  }

  async getJobStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    closed: number;
    expired: number;
  }> {
    const [total, active, pending, closed, expired] = await Promise.all([
      this.repository.count(),
      this.repository.count({ where: { status: JobStatus.PUBLISHED } }),
      this.repository.count({ where: { status: JobStatus.PENDING_TO_REVIEW } }),
      this.repository.count({ where: { status: JobStatus.CLOSED } }),
      this.repository.count({ where: { status: JobStatus.EXPIRED } }),
    ]);

    return { total, active, pending, closed, expired };
  }

  async getJobsWithApplicationCount(): Promise<Job[]> {
    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .leftJoinAndSelect('job.city', 'city')
      .leftJoinAndSelect('job.country', 'country')
      .addSelect('COUNT(jobApply.id)', 'applicationsCount')
      .addSelect('COUNT(jobReferral.id)', 'referralsCount')
      .leftJoin('job.jobApplies', 'jobApply')
      .leftJoin('job.jobReferrals', 'jobReferral')
      .groupBy('job.id')
      .addGroupBy('organization.id')
      .addGroupBy('speciality.id')
      .addGroupBy('city.id')
      .addGroupBy('country.id')
      .getMany();
  }

  async findWithFilters(filters: any): Promise<[Job[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .leftJoinAndSelect('job.skills', 'skills')
      .leftJoinAndSelect('job.city', 'city')
      .leftJoinAndSelect('job.country', 'country')
      .leftJoinAndSelect('job.region', 'region');

    // Apply filters
    if (filters.query) {
      queryBuilder.andWhere(
        '(job.title ILIKE :query OR job.about ILIKE :query OR organization.name ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.location_city) {
      queryBuilder.andWhere('city.id = :cityId', {
        cityId: filters.location_city,
      });
    }

    if (filters.location_country) {
      queryBuilder.andWhere('country.id = :countryId', {
        countryId: filters.location_country,
      });
    }

    if (filters.location_region) {
      queryBuilder.andWhere('region.id = :regionId', {
        regionId: filters.location_region,
      });
    }

    if (filters.experience_levels?.length) {
      queryBuilder.andWhere('job.experienceLevel IN (:...levels)', {
        levels: filters.experience_levels,
      });
    }

    if (filters.management_levels?.length) {
      queryBuilder.andWhere('job.managementLevel IN (:...levels)', {
        levels: filters.management_levels,
      });
    }

    if (filters.job_types?.length) {
      queryBuilder.andWhere('job.jobType IN (:...types)', {
        types: filters.job_types,
      });
    }

    if (filters.location_types?.length) {
      queryBuilder.andWhere('job.locationType IN (:...locationTypes)', {
        locationTypes: filters.location_types,
      });
    }

    if (filters.salary_range) {
      queryBuilder.andWhere(
        'job.salaryFromCents >= :minSalary AND job.salaryToCents <= :maxSalary',
        {
          minSalary: filters.salary_range.min * 100,
          maxSalary: filters.salary_range.max * 100,
        },
      );
    }

    if (filters.ids?.length) {
      queryBuilder.andWhere('job.id IN (:...ids)', { ids: filters.ids });
    }

    // Only published jobs
    queryBuilder.andWhere('job.status = :status', {
      status: JobStatus.PUBLISHED,
    });

    // Partner host filter
    if (filters.partner_host) {
      queryBuilder.andWhere('job.partnerHostId = :partnerHostId', {
        partnerHostId: filters.partner_host,
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findSimilarJobs(jobId: string, limit: number = 10): Promise<Job[]> {
    const job = await this.repository.findOne({
      where: { id: jobId },
      relations: ['speciality', 'skills'],
    });

    if (!job) return [];

    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .where('job.id != :jobId', { jobId })
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('job.specialityId = :specialityId', {
        specialityId: job.specialityId,
      })
      .orderBy('job.postedDate', 'DESC')
      .limit(limit)
      .getMany();
  }

  async generateJobNumber(): Promise<number> {
    return await this.repository.manager.transaction(async manager => {
      const lastJob = await manager
        .createQueryBuilder(this.repository.target, 'job')
        .setLock('pessimistic_write')
        .orderBy('job.jobNumber', 'DESC')
        .getOne();

      const newJobNumber = lastJob ? Number(lastJob.jobNumber) + 1 : 1;

      return newJobNumber;
    });
  }

  async count(options?: any): Promise<number> {
    return this.repository.count(options);
  }
}
