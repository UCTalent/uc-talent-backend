import { Injectable, NotFoundException } from '@nestjs/common';

import type { ExternalLink } from '../entities/external-link.entity';
import { ExternalLinkRepository } from '../repositories/external-link.repository';

@Injectable()
export class ExternalLinkService {
  constructor(private readonly externalLinkRepo: ExternalLinkRepository) {}

  async createExternalLink(data: Partial<ExternalLink>): Promise<ExternalLink> {
    return this.externalLinkRepo.create(data);
  }

  async findExternalLinkById(id: string): Promise<ExternalLink> {
    const externalLink = await this.externalLinkRepo.findById(id);

    if (!externalLink) {
      throw new NotFoundException('External link not found');
    }

    return externalLink;
  }

  async findExternalLinksByTalentId(talentId: string): Promise<ExternalLink[]> {
    return this.externalLinkRepo.findByTalentId(talentId);
  }

  async updateExternalLink(
    id: string,
    data: Partial<ExternalLink>
  ): Promise<ExternalLink> {
    return this.externalLinkRepo.update(id, data);
  }

  async deleteExternalLink(id: string): Promise<void> {
    const externalLink = await this.findExternalLinkById(id);
    await this.externalLinkRepo.delete(id);
  }
}
