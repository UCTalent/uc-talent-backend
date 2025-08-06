import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialSetting } from '@domains/social/entities/social-setting.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class SocialSettingRepository implements IBaseRepository<SocialSetting> {
  constructor(
    @InjectRepository(SocialSetting)
    private readonly repository: Repository<SocialSetting>,
  ) {}

  async findById(id: string): Promise<SocialSetting | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findAll(): Promise<SocialSetting[]> {
    return this.repository.find({
      relations: ['user'],
    });
  }

  async create(data: Partial<SocialSetting>): Promise<SocialSetting> {
    const socialSetting = this.repository.create(data);
    return this.repository.save(socialSetting);
  }

  async update(id: string, data: Partial<SocialSetting>): Promise<SocialSetting> {
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

  async findByUser(userId: string): Promise<SocialSetting | null> {
    return this.repository.findOne({
      where: { userId }
    });
  }

  async findOrCreateByUser(userId: string): Promise<SocialSetting> {
    let setting = await this.findByUser(userId);
    
    if (!setting) {
      setting = this.repository.create({
        userId,
        showLinkedInProfile: true,
        showGitHubRepos: true,
        showSocialConnections: false,
        allowProfileSync: true,
        publicSocialLinks: [],
        autoSync: true,
        syncFrequency: 'daily',
        syncFields: ['profile', 'connections']
      });
      setting = await this.repository.save(setting);
    }

    return setting;
  }

  async findUsersWithAutoSync(): Promise<SocialSetting[]> {
    return this.repository.find({
      where: { autoSync: true },
      relations: ['user']
    });
  }
}