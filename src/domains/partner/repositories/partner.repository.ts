import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '@domains/partner/entities/partner.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class PartnerRepository implements IBaseRepository<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly repository: Repository<Partner>,
  ) {}

  async findById(id: string): Promise<Partner | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partnerHosts'],
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
      relations: ['partnerHosts']
    });
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