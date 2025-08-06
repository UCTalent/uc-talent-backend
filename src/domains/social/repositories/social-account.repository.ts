import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '@social/entities/social-account.entity';
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

  async findByUserId(userId: string): Promise<SocialAccount[]> {
    return this.repository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async findByProviderAndUid(provider: string, uid: string): Promise<SocialAccount | null> {
    return this.repository.findOne({
      where: { provider, uid },
      relations: ['user'],
    });
  }
} 