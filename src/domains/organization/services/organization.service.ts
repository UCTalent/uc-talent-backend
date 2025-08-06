import { Injectable, NotFoundException } from '@nestjs/common';
import { Organization } from '@organization/entities/organization.entity';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationRepository } from '@organization/repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.create(createOrganizationDto);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.findAll();
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findById(id);
    return this.organizationRepository.update(id, updateOrganizationDto);
  }

  async delete(id: string): Promise<void> {
    const organization = await this.findById(id);
    await this.organizationRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const organization = await this.findById(id);
    await this.organizationRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.organizationRepository.restore(id);
  }
} 