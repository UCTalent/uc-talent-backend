import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerHost } from '@domains/partner/entities/partner-host.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';
import * as crypto from 'crypto';

@Injectable()
export class PartnerHostRepository implements IBaseRepository<PartnerHost> {
  constructor(
    @InjectRepository(PartnerHost)
    private readonly repository: Repository<PartnerHost>,
  ) {}

  async findById(id: string): Promise<PartnerHost | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partner', 'networks'],
    });
  }

  async findByIdWithJobs(id: string): Promise<PartnerHost | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partner', 'networks', 'jobs'],
    });
  }

  async findAll(): Promise<PartnerHost[]> {
    return this.repository.find({
      relations: ['partner', 'networks'],
    });
  }

  async create(data: Partial<PartnerHost>): Promise<PartnerHost> {
    const partnerHost = this.repository.create(data);
    return this.repository.save(partnerHost);
  }

  async update(id: string, data: Partial<PartnerHost>): Promise<PartnerHost> {
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

  async findByHost(host: string): Promise<PartnerHost | null> {
    return this.repository.findOne({
      where: { host },
      relations: ['partner', 'networks'],
    });
  }

  async findBySlug(slug: string): Promise<PartnerHost | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async findByAccessToken(accessToken: string): Promise<PartnerHost | null> {
    return this.repository.findOne({ 
      where: { accessToken },
      relations: ['partner', 'networks']
    });
  }

  async findByPartner(partnerId: string): Promise<PartnerHost[]> {
    return this.repository.find({
      where: { partnerId },
      relations: ['networks', 'jobs']
    });
  }

  // New method for complex queries
  async findWithFilters(options: {
    search?: string;
    partnerId?: string;
    isUcTalent?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<{ data: PartnerHost[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('host')
      .leftJoinAndSelect('host.partner', 'partner')
      .leftJoinAndSelect('host.networks', 'networks');

    if (options.search) {
      queryBuilder.where(
        'host.host ILIKE :search OR host.slug ILIKE :search OR partner.name ILIKE :search',
        { search: `%${options.search}%` }
      );
    }

    if (options.partnerId) {
      queryBuilder.andWhere('host.partnerId = :partnerId', { partnerId: options.partnerId });
    }

    if (options.isUcTalent !== undefined) {
      queryBuilder.andWhere('host.isUcTalent = :isUcTalent', { isUcTalent: options.isUcTalent });
    }

    if (options.sortBy) {
      queryBuilder.orderBy(`host.${options.sortBy}`, options.sortOrder || 'DESC');
    } else {
      queryBuilder.orderBy('host.createdAt', 'DESC');
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

  async findWithStats(): Promise<PartnerHost[]> {
    return this.repository
      .createQueryBuilder('host')
      .leftJoinAndSelect('host.partner', 'partner')
      .leftJoinAndSelect('host.networks', 'networks')
      .addSelect('COUNT(jobs.id)', 'jobsCount')
      .addSelect('COUNT(networks.id)', 'networksCount')
      .leftJoin('host.jobs', 'jobs')
      .groupBy('host.id')
      .addGroupBy('partner.id')
      .getMany();
  }

  async generateAccessToken(): Promise<string> {
    return crypto.randomBytes(20).toString('hex');
  }
} 