import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';
import { Role } from '@skill/entities/role.entity';

@Injectable()
export class RoleRepository implements IBaseRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async findById(id: string): Promise<Role | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['skills'],
    });
  }

  async findAll(): Promise<Role[]> {
    return this.repository.find({
      relations: ['skills'],
    });
  }

  async create(data: Partial<Role>): Promise<Role> {
    const role = this.repository.create(data);
    return this.repository.save(role);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
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
