import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '@partner/entities/partner.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class PartnerRepository implements IBaseRepository<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly repository: Repository<Partner>,
  ) {}

  async findById(id: string): Promise<Partner | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['hosts'],
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.find({
      relations: ['hosts'],
    });
  }

  async create(data: Partial<Partner>): Promise<Partner> {
    const partner = this.repository.create(data);
    return this.repository.save(partner);
  }

  async update(id: string, data: Partial<Partner>): Promise<Partner> {
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