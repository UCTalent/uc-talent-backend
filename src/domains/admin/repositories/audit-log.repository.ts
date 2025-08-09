import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from '@admin/entities/audit-log.entity';
import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class AuditLogRepository implements IBaseRepository<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repository: Repository<AuditLog>
  ) {}

  async findById(id: string): Promise<AuditLog | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['admin'],
    });
  }

  async findAll(): Promise<AuditLog[]> {
    return this.repository.find({
      relations: ['admin'],
    });
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    const auditLog = this.repository.create(data);
    return this.repository.save(auditLog);
  }

  async update(id: string, data: Partial<AuditLog>): Promise<AuditLog> {
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

  async findByAdmin(
    adminId: string,
    options?: { page?: number; limit?: number }
  ): Promise<[AuditLog[], number]> {
    const { page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    return this.repository.findAndCount({
      where: { adminId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findByAction(
    action: string,
    options?: { page?: number; limit?: number }
  ): Promise<[AuditLog[], number]> {
    const { page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    return this.repository.findAndCount({
      where: { action },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async log(data: {
    action: string;
    adminId: string;
    targetType?: string;
    targetId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const auditLog = this.repository.create(data);
    return this.repository.save(auditLog);
  }

  // New method for admin service
  async findWithFilters(options: {
    action?: string;
    adminId?: string;
    dateFrom?: string;
    dateTo?: string;
    skip?: number;
    take?: number;
  }): Promise<{ data: AuditLog[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.admin', 'admin');

    if (options.action) {
      queryBuilder.andWhere('auditLog.action = :action', {
        action: options.action,
      });
    }

    if (options.adminId) {
      queryBuilder.andWhere('auditLog.adminId = :adminId', {
        adminId: options.adminId,
      });
    }

    if (options.dateFrom) {
      queryBuilder.andWhere('auditLog.createdAt >= :dateFrom', {
        dateFrom: options.dateFrom,
      });
    }

    if (options.dateTo) {
      queryBuilder.andWhere('auditLog.createdAt <= :dateTo', {
        dateTo: options.dateTo,
      });
    }

    queryBuilder.orderBy('auditLog.createdAt', 'DESC');

    if (options.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options.take !== undefined) {
      queryBuilder.take(options.take);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }
}
