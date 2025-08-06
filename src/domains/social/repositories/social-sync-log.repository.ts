import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialSyncLog, SyncStatus } from '@domains/social/entities/social-sync-log.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class SocialSyncLogRepository implements IBaseRepository<SocialSyncLog> {
  constructor(
    @InjectRepository(SocialSyncLog)
    private readonly repository: Repository<SocialSyncLog>,
  ) {}

  async findById(id: string): Promise<SocialSyncLog | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['socialAccount'],
    });
  }

  async findAll(): Promise<SocialSyncLog[]> {
    return this.repository.find({
      relations: ['socialAccount'],
    });
  }

  async create(data: Partial<SocialSyncLog>): Promise<SocialSyncLog> {
    const socialSyncLog = this.repository.create(data);
    return this.repository.save(socialSyncLog);
  }

  async update(id: string, data: Partial<SocialSyncLog>): Promise<SocialSyncLog> {
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

  async findBySocialAccount(socialAccountId: string, options?: { limit?: number }): Promise<SocialSyncLog[]> {
    const { limit = 10 } = options || {};

    return this.repository.find({
      where: { socialAccountId },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async findRecentLogs(days: number = 7): Promise<SocialSyncLog[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    return this.repository
      .createQueryBuilder('sync_log')
      .leftJoinAndSelect('sync_log.socialAccount', 'social_account')
      .where('sync_log.createdAt >= :fromDate', { fromDate })
      .orderBy('sync_log.createdAt', 'DESC')
      .getMany();
  }

  async getSyncStats(socialAccountId?: string): Promise<any> {
    const queryBuilder = this.repository
      .createQueryBuilder('sync_log')
      .select('sync_log.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(sync_log.syncDurationMs)', 'avgDuration')
      .groupBy('sync_log.status');

    if (socialAccountId) {
      queryBuilder.where('sync_log.socialAccountId = :socialAccountId', { socialAccountId });
    }

    return queryBuilder.getRawMany();
  }

  async logSync(data: {
    socialAccountId: string;
    status: SyncStatus;
    syncType: string;
    changesCount?: number;
    changes?: any[];
    errorMessage?: string;
    syncDurationMs?: number;
  }): Promise<SocialSyncLog> {
    const syncLog = this.repository.create(data);
    return this.repository.save(syncLog);
  }
}