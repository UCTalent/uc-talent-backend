import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      relations: ['organization', 'speciality', 'skills']
    });
  }

  async findByOrganization(organizationId: string): Promise<Job[]> {
    return this.repository.find({
      where: { organizationId },
      relations: ['speciality', 'skills']
    });
  }

  async findByPartnerHost(partnerHostId: string): Promise<Job[]> {
    return this.repository.find({
      where: { partnerHostId },
      relations: ['organization', 'speciality']
    });
  }

  async findWithFilters(filters: any): Promise<[Job[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('job')
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
        { query: `%${filters.query}%` }
      );
    }

    if (filters.location_city) {
      queryBuilder.andWhere('city.id = :cityId', { cityId: filters.location_city });
    }

    if (filters.location_country) {
      queryBuilder.andWhere('country.id = :countryId', { countryId: filters.location_country });
    }

    if (filters.location_region) {
      queryBuilder.andWhere('region.id = :regionId', { regionId: filters.location_region });
    }

    if (filters.experience_levels?.length) {
      queryBuilder.andWhere('job.experienceLevel IN (:...levels)', { 
        levels: filters.experience_levels 
      });
    }

    if (filters.management_levels?.length) {
      queryBuilder.andWhere('job.managementLevel IN (:...levels)', { 
        levels: filters.management_levels 
      });
    }

    if (filters.job_types?.length) {
      queryBuilder.andWhere('job.jobType IN (:...types)', { 
        types: filters.job_types 
      });
    }

    if (filters.location_types?.length) {
      queryBuilder.andWhere('job.locationType IN (:...locationTypes)', { 
        locationTypes: filters.location_types 
      });
    }

    if (filters.salary_range) {
      queryBuilder.andWhere(
        'job.salaryFromCents >= :minSalary AND job.salaryToCents <= :maxSalary',
        { 
          minSalary: filters.salary_range.min * 100,
          maxSalary: filters.salary_range.max * 100
        }
      );
    }

    if (filters.ids?.length) {
      queryBuilder.andWhere('job.id IN (:...ids)', { ids: filters.ids });
    }

    // Only published jobs
    queryBuilder.andWhere('job.status = :status', { status: JobStatus.PUBLISHED });

    // Partner host filter
    if (filters.partner_host) {
      queryBuilder.andWhere('job.partnerHostId = :partnerHostId', { 
        partnerHostId: filters.partner_host 
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findSimilarJobs(jobId: string, limit: number = 10): Promise<Job[]> {
    const job = await this.repository.findOne({
      where: { id: jobId },
      relations: ['speciality', 'skills']
    });

    if (!job) return [];

    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .where('job.id != :jobId', { jobId })
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('job.specialityId = :specialityId', { specialityId: job.specialityId })
      .orderBy('job.postedDate', 'DESC')
      .limit(limit)
      .getMany();
  }

  async generateJobNumber(): Promise<number> {
    const lastJob = await this.repository.findOne({
      order: { jobNumber: 'DESC' }
    });
    
    return lastJob ? lastJob.jobNumber + 1 : 1;
  }
} 