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