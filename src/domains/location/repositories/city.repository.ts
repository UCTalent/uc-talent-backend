import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '@location/entities/city.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class CityRepository implements IBaseRepository<City> {
  constructor(
    @InjectRepository(City)
    private readonly repository: Repository<City>,
  ) {}

  async findById(id: string): Promise<City | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['country'],
    });
  }

  async findAll(): Promise<City[]> {
    return this.repository.find({
      relations: ['country'],
    });
  }

  async create(data: Partial<City>): Promise<City> {
    const city = this.repository.create(data);
    return this.repository.save(city);
  }

  async update(id: string, data: Partial<City>): Promise<City> {
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

  async findByCountryId(countryId: string): Promise<City[]> {
    return this.repository.find({
      where: { countryId },
      relations: ['country'],
    });
  }
}
