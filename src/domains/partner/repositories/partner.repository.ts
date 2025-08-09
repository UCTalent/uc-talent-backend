import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partner } from '@domains/partner/entities/partner.entity';
import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class PartnerRepository implements IBaseRepository<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly repository: Repository<Partner>
  ) {}

  async findById(id: string): Promise<Partner | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partnerHosts'],
    });
  }

  async findByIdWithHosts(id: string): Promise<Partner | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partnerHosts', 'partnerHosts.networks', 'partnerHosts.jobs'],
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.repository.find({
      relations: ['partnerHosts'],
    });
  }

  async create(data: Partial<Partner>): Promise<Partner> {
    const partner = this.repository.create(data);
    return this.repository.save(partner);
  }

  async update(id: string, data: Partial<Partner>): Promise<Partner> {
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

  async findBySlug(slug: string): Promise<Partner | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async findByName(name: string): Promise<Partner | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findUcTalentPartners(): Promise<Partner[]> {
    return this.repository.find({
      where: { isUcTalent: true },
      relations: ['partnerHosts'],
    });
  }

  // New methods for complex queries
  async findWithFilters(options: {
    search?: string;
    isUcTalent?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<{ data: Partner[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.partnerHosts', 'hosts');

    if (options.search) {
      queryBuilder.where(
        'partner.name ILIKE :search OR partner.description ILIKE :search',
        { search: `%${options.search}%` }
      );
    }

    if (options.isUcTalent !== undefined) {
      queryBuilder.andWhere('partner.isUcTalent = :isUcTalent', {
        isUcTalent: options.isUcTalent,
      });
    }

    if (options.sortBy) {
      queryBuilder.orderBy(
        `partner.${options.sortBy}`,
        options.sortOrder || 'DESC'
      );
    } else {
      queryBuilder.orderBy('partner.createdAt', 'DESC');
    }

    if (options.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options.take !== undefined) {
      queryBuilder.take(options.take);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findWithStats(): Promise<Partner[]> {
    return this.repository
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.partnerHosts', 'hosts')
      .addSelect('COUNT(DISTINCT hosts.id)', 'hostsCount')
      .addSelect('COUNT(DISTINCT networks.id)', 'networksCount')
      .addSelect('COUNT(DISTINCT jobs.id)', 'jobsCount')
      .leftJoin('hosts.networks', 'networks')
      .leftJoin('hosts.jobs', 'jobs')
      .groupBy('partner.id')
      .getMany();
  }
}
