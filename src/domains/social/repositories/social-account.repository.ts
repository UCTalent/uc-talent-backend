import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount, SocialProvider, SocialAccountStatus } from '@domains/social/entities/social-account.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class SocialAccountRepository implements IBaseRepository<SocialAccount> {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly repository: Repository<SocialAccount>,
  ) {}

  async findById(id: string): Promise<SocialAccount | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findAll(): Promise<SocialAccount[]> {
    return this.repository.find({
      relations: ['user'],
    });
  }

  async create(data: Partial<SocialAccount>): Promise<SocialAccount> {
    const socialAccount = this.repository.create(data);
    return this.repository.save(socialAccount);
  }

  async update(id: string, data: Partial<SocialAccount>): Promise<SocialAccount> {
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

  // Legacy method for backward compatibility
  async findByUserId(userId: string): Promise<SocialAccount[]> {
    return this.findByUser(userId);
  }

  async findByProviderAndUid(provider: SocialProvider, uid: string): Promise<SocialAccount | null> {
    return this.repository.findOne({
      where: { provider, uid },
      relations: ['user']
    });
  }

  async findByUserAndProvider(userId: string, provider: SocialProvider): Promise<SocialAccount | null> {
    return this.repository.findOne({
      where: { userId, provider }
    });
  }

  async findByUser(userId: string): Promise<SocialAccount[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveByUser(userId: string): Promise<SocialAccount[]> {
    return this.repository.find({
      where: { userId, status: SocialAccountStatus.ACTIVE },
      order: { createdAt: 'DESC' }
    });
  }

  async findExpiredTokens(): Promise<SocialAccount[]> {
    return this.repository
      .createQueryBuilder('social_account')
      .where('social_account.expiresAt < :now', { now: new Date() })
      .andWhere('social_account.refreshToken IS NOT NULL')
      .andWhere('social_account.status = :status', { status: SocialAccountStatus.ACTIVE })
      .getMany();
  }

  async findByProvider(provider: SocialProvider): Promise<SocialAccount[]> {
    return this.repository.find({
      where: { provider },
      relations: ['user']
    });
  }

  async searchByMetadata(searchTerm: string, provider?: SocialProvider): Promise<SocialAccount[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('social_account')
      .leftJoinAndSelect('social_account.user', 'user')
      .where(
        `(
          social_account.metadata->>'displayName' ILIKE :search OR
          social_account.metadata->>'email' ILIKE :search OR
          social_account.metadata->>'headline' ILIKE :search OR
          social_account.metadata->>'bio' ILIKE :search
        )`,
        { search: `%${searchTerm}%` }
      );

    if (provider) {
      queryBuilder.andWhere('social_account.provider = :provider', { provider });
    }

    return queryBuilder.getMany();
  }
} 