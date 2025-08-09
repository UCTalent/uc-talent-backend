import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';
import { ExternalLink } from '@social/entities/external-link.entity';

@Injectable()
export class ExternalLinkRepository implements IBaseRepository<ExternalLink> {
  constructor(
    @InjectRepository(ExternalLink)
    private readonly repository: Repository<ExternalLink>
  ) {}

  async findById(id: string): Promise<ExternalLink | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['talent'],
    });
  }

  async findAll(): Promise<ExternalLink[]> {
    return this.repository.find({
      relations: ['talent'],
    });
  }

  async create(data: Partial<ExternalLink>): Promise<ExternalLink> {
    const externalLink = this.repository.create(data);
    return this.repository.save(externalLink);
  }

  async update(id: string, data: Partial<ExternalLink>): Promise<ExternalLink> {
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

  async findByTalentId(talentId: string): Promise<ExternalLink[]> {
    return this.repository.find({
      where: { talentId },
      relations: ['talent'],
    });
  }
}
