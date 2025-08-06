import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@admin/entities/admin.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class AdminRepository implements IBaseRepository<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>,
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
      relations: ['permissions']
    });
  }

  async findActiveAdmins(): Promise<Admin[]> {
    return this.repository.find({ 
      where: { status: 'active' },
      relations: ['permissions']
    });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    await this.repository.increment({ id }, 'loginAttempts', 1);
  }

  async resetLoginAttempts(id: string): Promise<void> {
    await this.repository.update(id, { loginAttempts: 0, lockedUntil: null });
  }
} 