import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@organization/entities/organization.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class OrganizationRepository implements IBaseRepository<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {}

  async findById(id: string): Promise<Organization | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<Organization | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['industry', 'city', 'country', 'jobs']
    });
  }

  async findAll(): Promise<Organization[]> {
    return this.repository.find();
  }

  async create(data: Partial<Organization>): Promise<Organization> {
    const organization = this.repository.create(data);
    return this.repository.save(organization);
  }

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
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

  // New methods for complex queries
  async findWithFilters(options: {
    search?: string;
    status?: string;
    industry?: string;
    country?: string;
    city?: string;
    size?: string;
    orgType?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<{ data: Organization[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country');

    if (options.search) {
      queryBuilder.where(
        'org.name ILIKE :search OR org.about ILIKE :search',
        { search: `%${options.search}%` }
      );
    }

    if (options.status) {
      queryBuilder.andWhere('org.status = :status', { status: options.status });
    }

    if (options.industry) {
      queryBuilder.andWhere('industry.id = :industry', { industry: options.industry });
    }

    if (options.country) {
      queryBuilder.andWhere('country.id = :country', { country: options.country });
    }

    if (options.city) {
      queryBuilder.andWhere('city.id = :city', { city: options.city });
    }

    if (options.size) {
      queryBuilder.andWhere('org.size = :size', { size: options.size });
    }

    if (options.orgType) {
      queryBuilder.andWhere('org.orgType = :orgType', { orgType: options.orgType });
    }

    if (options.sortBy) {
      queryBuilder.orderBy(`org.${options.sortBy}`, options.sortOrder || 'DESC');
    } else {
      queryBuilder.orderBy('org.createdAt', 'DESC');
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

  async searchWithFilters(query: string, filters?: {
    industry?: string;
    country?: string;
    city?: string;
    size?: string;
    orgType?: string;
  }): Promise<Organization[]> {
    const queryBuilder = this.repository.createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country');

    if (query) {
      queryBuilder.where(
        'org.name ILIKE :query OR org.about ILIKE :query',
        { query: `%${query}%` }
      );
    }

    if (filters) {
      if (filters.industry) {
        queryBuilder.andWhere('industry.id = :industry', { industry: filters.industry });
      }
      if (filters.country) {
        queryBuilder.andWhere('country.id = :country', { country: filters.country });
      }
      if (filters.city) {
        queryBuilder.andWhere('city.id = :city', { city: filters.city });
      }
      if (filters.size) {
        queryBuilder.andWhere('org.size = :size', { size: filters.size });
      }
      if (filters.orgType) {
        queryBuilder.andWhere('org.orgType = :orgType', { orgType: filters.orgType });
      }
    }

    return queryBuilder.getMany();
  }

  async getOrganizationStats(organizationId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
  }> {
    const [totalJobs, activeJobs] = await Promise.all([
      this.repository
        .createQueryBuilder('org')
        .leftJoin('org.jobs', 'jobs')
        .where('org.id = :organizationId', { organizationId })
        .getCount(),
      this.repository
        .createQueryBuilder('org')
        .leftJoin('org.jobs', 'jobs')
        .where('org.id = :organizationId', { organizationId })
        .andWhere('jobs.status = :status', { status: 'published' })
        .getCount()
    ]);

    return { totalJobs, activeJobs };
  }

  async getOrganizationsWithJobCounts(): Promise<Organization[]> {
    return this.repository
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .addSelect('COUNT(jobs.id)', 'jobsCount')
      .leftJoin('org.jobs', 'jobs')
      .groupBy('org.id')
      .addGroupBy('industry.id')
      .addGroupBy('city.id')
      .addGroupBy('country.id')
      .getMany();
  }
} 