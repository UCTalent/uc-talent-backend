import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Admin } from '@admin/entities/admin.entity';
import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class AdminRepository implements IBaseRepository<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>
  ) {}

  async findById(id: string): Promise<Admin | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findAll(): Promise<Admin[]> {
    return this.repository.find({
      relations: ['permissions'],
    });
  }

  async create(data: Partial<Admin>): Promise<Admin> {
    const admin = this.repository.create(data);
    return this.repository.save(admin);
  }

  async update(id: string, data: Partial<Admin>): Promise<Admin> {
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

  async findByEmail(email: string): Promise<Admin | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['permissions'],
    });
  }

  async findActiveAdmins(): Promise<Admin[]> {
    return this.repository.find({
      where: { status: 'active' },
      relations: ['permissions'],
    });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    await this.repository.increment({ id }, 'loginAttempts', 1);
  }

  async resetLoginAttempts(id: string): Promise<void> {
    await this.repository.update(id, { loginAttempts: 0, lockedUntil: null });
  }

  // New methods for admin service
  async findWithFilters(options: {
    search?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<{ data: Admin[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.permissions', 'permissions');

    if (options.search) {
      queryBuilder.where(
        'admin.email ILIKE :search OR admin.firstName ILIKE :search OR admin.lastName ILIKE :search',
        { search: `%${options.search}%` }
      );
    }

    if (options.status) {
      queryBuilder.andWhere('admin.status = :status', {
        status: options.status,
      });
    }

    if (options.role) {
      queryBuilder.andWhere('admin.role = :role', { role: options.role });
    }

    if (options.sortBy) {
      queryBuilder.orderBy(
        `admin.${options.sortBy}`,
        options.sortOrder || 'DESC'
      );
    } else {
      queryBuilder.orderBy('admin.createdAt', 'DESC');
    }

    if (options.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options.take !== undefined) {
      queryBuilder.take(options.take);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findByIds(ids: string[]): Promise<Admin[]> {
    return this.repository.find({
      where: { id: { $in: ids } as any },
      relations: ['permissions'],
    });
  }

  async findByStatus(status: string): Promise<Admin[]> {
    return this.repository.find({
      where: { status },
      relations: ['permissions'],
    });
  }

  async countByStatus(status: string): Promise<number> {
    return this.repository.count({ where: { status } });
  }

  async findRecentAdmins(limit: number = 10): Promise<Admin[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['permissions'],
    });
  }
}
