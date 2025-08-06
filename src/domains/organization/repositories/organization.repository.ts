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
} 