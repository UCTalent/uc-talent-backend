import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Country } from '@location/entities/country.entity';
import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class CountryRepository implements IBaseRepository<Country> {
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>
  ) {}

  async findById(id: string): Promise<Country | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Country[]> {
    return this.repository.find();
  }

  async create(data: Partial<Country>): Promise<Country> {
    const country = this.repository.create(data);
    return this.repository.save(country);
  }

  async update(id: string, data: Partial<Country>): Promise<Country> {
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
