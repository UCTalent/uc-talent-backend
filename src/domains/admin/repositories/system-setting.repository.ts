import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '@admin/entities/system-setting.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class SystemSettingRepository implements IBaseRepository<SystemSetting> {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly repository: Repository<SystemSetting>,
  ) {}

  async findById(id: string): Promise<SystemSetting | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<SystemSetting[]> {
    return this.repository.find();
  }

  async create(data: Partial<SystemSetting>): Promise<SystemSetting> {
    const systemSetting = this.repository.create(data);
    return this.repository.save(systemSetting);
  }

  async update(id: string, data: Partial<SystemSetting>): Promise<SystemSetting> {
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

  async findByKey(key: string): Promise<SystemSetting | null> {
    return this.repository.findOne({ where: { key } });
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    const setting = await this.findByKey(key);
    if (!setting) return defaultValue;

    switch (setting.type) {
      case 'number':
        return Number(setting.value);
      case 'boolean':
        return setting.value === 'true';
      case 'json':
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  }

  async setValue(key: string, value: any, description?: string): Promise<SystemSetting> {
    let setting = await this.findByKey(key);
    
    if (!setting) {
      setting = this.repository.create({
        key,
        value: String(value),
        description,
        type: typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'
      });
    } else {
      setting.value = String(value);
      if (description) setting.description = description;
    }

    return this.repository.save(setting);
  }
} 