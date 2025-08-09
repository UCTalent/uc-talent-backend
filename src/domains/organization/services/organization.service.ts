import { Injectable, NotFoundException } from '@nestjs/common';

import { Job, JobStatus } from '@job/entities/job.entity';
import { JobRepository } from '@job/repositories/job.repository';
import type { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import type { OrganizationQueryDto } from '@organization/dtos/organization-query.dto';
import type { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import type { Organization } from '@organization/entities/organization.entity';
import { OrganizationRepository } from '@organization/repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private organizationRepo: OrganizationRepository,
    private jobRepo: JobRepository
  ) {}

  async getOrganizations(query: OrganizationQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      industry,
      country,
      city,
      size,
      orgType,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    const { data: organizations, total } =
      await this.organizationRepo.findWithFilters({
        search,
        status,
        industry,
        country,
        city,
        size,
        orgType,
        sortBy,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        skip,
        take: limit,
      });

    // Get jobs count for each organization
    const organizationsWithStats = await Promise.all(
      organizations.map(async (org) => {
        const jobsCount = await this.jobRepo.count({
          where: { organizationId: org.id },
        });
        return {
          ...org,
          jobsCount,
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
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepo.findByIdWithRelations(id);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Get additional stats
    const stats = await this.organizationRepo.getOrganizationStats(id);

    return {
      success: true,
      data: {
        ...organization,
        stats,
      },
    };
  }

  async createOrganization(createDto: CreateOrganizationDto) {
    const dto: any = { ...createDto };
    if (dto.foundDate && typeof dto.foundDate === 'string') {
      dto.foundDate = new Date(dto.foundDate);
    }

    const organization = await this.organizationRepo.create(dto);

    return {
      success: true,
      data: organization,
    };
  }

  async updateOrganization(id: string, updateDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepo.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const dto: any = { ...updateDto };
    if (dto.foundDate && typeof dto.foundDate === 'string') {
      dto.foundDate = new Date(dto.foundDate);
    }

    const updatedOrganization = await this.organizationRepo.update(id, dto);

    return {
      success: true,
      data: updatedOrganization,
    };
  }

  async deleteOrganization(id: string) {
    const organization = await this.organizationRepo.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.organizationRepo.delete(id);

    return {
      success: true,
      message: 'Organization deleted successfully',
    };
  }

  async searchOrganizations(query: string, filters?: any) {
    const organizations = await this.organizationRepo.searchWithFilters(
      query,
      filters
    );

    return {
      success: true,
      data: {
        organizations,
        searchStats: {
          query,
          totalResults: organizations.length,
          searchTime: 0.15, // Mock value
        },
      },
    };
  }

  // Legacy methods for backward compatibility
  async create(
    createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization> {
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

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<Organization> {
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
