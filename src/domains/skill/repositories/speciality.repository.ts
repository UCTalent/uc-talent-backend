import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';
import { Speciality } from '@skill/entities/speciality.entity';

@Injectable()
export class SpecialityRepository implements IBaseRepository<Speciality> {
  constructor(
    @InjectRepository(Speciality)
    private readonly repository: Repository<Speciality>
  ) {}

  async findById(id: string): Promise<Speciality | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Speciality[]> {
    return this.repository.find();
  }

  async create(data: Partial<Speciality>): Promise<Speciality> {
    const speciality = this.repository.create(data);
    return this.repository.save(speciality);
  }

  async update(id: string, data: Partial<Speciality>): Promise<Speciality> {
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
