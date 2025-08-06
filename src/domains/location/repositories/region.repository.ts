import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '@location/entities/region.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class RegionRepository implements IBaseRepository<Region> {
  constructor(
    @InjectRepository(Region)
    private readonly repository: Repository<Region>,
  ) {}

  async findById(id: string): Promise<Region | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Region[]> {
    return this.repository.find();
  }

  async create(data: Partial<Region>): Promise<Region> {
    const region = this.repository.create(data);
    return this.repository.save(region);
  }

  async update(id: string, data: Partial<Region>): Promise<Region> {
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