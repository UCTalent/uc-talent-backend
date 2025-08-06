import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalLink } from '../entities/external-link.entity';

@Injectable()
export class ExternalLinkService {
  constructor(
    @InjectRepository(ExternalLink)
    private readonly externalLinkRepository: Repository<ExternalLink>,
  ) {}

  async createExternalLink(data: Partial<ExternalLink>): Promise<ExternalLink> {
    const externalLink = this.externalLinkRepository.create(data);
    return this.externalLinkRepository.save(externalLink);
  }

  async findExternalLinkById(id: string): Promise<ExternalLink> {
    const externalLink = await this.externalLinkRepository.findOne({
      where: { id },
      relations: ['talent'],
    });
    
    if (!externalLink) {
      throw new NotFoundException('External link not found');
    }
    
    return externalLink;
  }

  async findExternalLinksByTalentId(talentId: string): Promise<ExternalLink[]> {
    return this.externalLinkRepository.find({
      where: { talentId },
      relations: ['talent'],
    });
  }

  async updateExternalLink(id: string, data: Partial<ExternalLink>): Promise<ExternalLink> {
    await this.externalLinkRepository.update(id, data);
    return this.findExternalLinkById(id);
  }

  async deleteExternalLink(id: string): Promise<void> {
    const externalLink = await this.findExternalLinkById(id);
    await this.externalLinkRepository.remove(externalLink);
  }
} 