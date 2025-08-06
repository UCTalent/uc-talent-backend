import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@organization/entities/organization.entity';
import { Job, JobStatus } from '@job/entities/job.entity';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationQueryDto } from '@organization/dtos/organization-query.dto';
import { OrganizationRepository } from '@organization/repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private organizationRepo: OrganizationRepository,
  ) {}

  async getOrganizations(query: OrganizationQueryDto) {
    const { page = 1, limit = 20, search, status, industry, country, city, size, orgType, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.organizationRepository.createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country');

    if (search) {
      queryBuilder.where(
        'org.name ILIKE :search OR org.about ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('org.status = :status', { status });
    }

    if (industry) {
      queryBuilder.andWhere('industry.id = :industry', { industry });
    }

    if (country) {
      queryBuilder.andWhere('country.id = :country', { country });
    }

    if (city) {
      queryBuilder.andWhere('city.id = :city', { city });
    }

    if (size) {
      queryBuilder.andWhere('org.size = :size', { size });
    }

    if (orgType) {
      queryBuilder.andWhere('org.orgType = :orgType', { orgType });
    }

    queryBuilder.orderBy(`org.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [organizations, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get jobs count for each organization
    const organizationsWithStats = await Promise.all(
      organizations.map(async (org) => {
        const jobsCount = await this.jobRepository.count({ where: { organizationId: org.id } });
        return {
          ...org,
          jobsCount
        };
      })
    );

    return {
      success: true,
      data: {
        organizations: organizationsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['industry', 'city', 'country', 'jobs']
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Get additional stats
    const [totalJobs, activeJobs] = await Promise.all([
      this.jobRepository.count({ where: { organizationId: id } }),
      this.jobRepository.count({ where: { organizationId: id, status: JobStatus.PUBLISHED } })
    ]);

    return {
      success: true,
      data: {
        ...organization,
        stats: {
          totalJobs,
          activeJobs
        }
      }
    };
  }

  async createOrganization(createDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(createDto);
    const savedOrganization = await this.organizationRepository.save(organization);

    return {
      success: true,
      data: savedOrganization
    };
  }

  async updateOrganization(id: string, updateDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateDto);
    const updatedOrganization = await this.organizationRepository.save(organization);

    return {
      success: true,
      data: updatedOrganization
    };
  }

  async deleteOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.organizationRepository.remove(organization);

    return {
      success: true,
      message: 'Organization deleted successfully'
    };
  }

  async searchOrganizations(query: string, filters?: any) {
    const queryBuilder = this.organizationRepository.createQueryBuilder('org')
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

    const organizations = await queryBuilder.getMany();

    return {
      success: true,
      data: {
        organizations,
        searchStats: {
          query,
          totalResults: organizations.length,
          searchTime: 0.15 // Mock value
        }
      }
    };
  }

  // Legacy methods for backward compatibility
  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const dto: any = { ...createOrganizationDto };
    if (dto.foundDate && typeof dto.foundDate === 'string') {
      dto.foundDate = new Date(dto.foundDate);
    }
    return this.organizationRepo.create(dto);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepo.findAll();
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationRepo.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findById(id);
    const dto: any = { ...updateOrganizationDto };
    if (dto.foundDate && typeof dto.foundDate === 'string') {
      dto.foundDate = new Date(dto.foundDate);
    }
    return this.organizationRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    const organization = await this.findById(id);
    await this.organizationRepo.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const organization = await this.findById(id);
    await this.organizationRepo.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.organizationRepo.restore(id);
  }
} 