import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PartnerHostNetwork,
  NetworkType,
} from '@domains/partner/entities/partner-host-network.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class PartnerHostNetworkRepository
  implements IBaseRepository<PartnerHostNetwork>
{
  constructor(
    @InjectRepository(PartnerHostNetwork)
    private readonly repository: Repository<PartnerHostNetwork>,
  ) {}

  async findById(id: string): Promise<PartnerHostNetwork | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['partnerHost'],
    });
  }

  async findAll(): Promise<PartnerHostNetwork[]> {
    return this.repository.find({
      relations: ['partnerHost'],
    });
  }

  async create(data: Partial<PartnerHostNetwork>): Promise<PartnerHostNetwork> {
    const partnerHostNetwork = this.repository.create(data);
    return this.repository.save(partnerHostNetwork);
  }

  async update(
    id: string,
    data: Partial<PartnerHostNetwork>,
  ): Promise<PartnerHostNetwork> {
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

  async findByPartnerHostId(
    partnerHostId: string,
  ): Promise<PartnerHostNetwork[]> {
    return this.repository.find({
      where: { partnerHostId },
      relations: ['partnerHost'],
    });
  }

  async findByPartnerHost(
    partnerHostId: string,
  ): Promise<PartnerHostNetwork[]> {
    return this.repository.find({
      where: { partnerHostId },
      order: { default: 'DESC', network: 'ASC' },
    });
  }

  async findByNetwork(
    partnerHostId: string,
    network: NetworkType,
  ): Promise<PartnerHostNetwork | null> {
    return this.repository.findOne({
      where: { partnerHostId, network },
    });
  }

  async findDefaultNetwork(
    partnerHostId: string,
  ): Promise<PartnerHostNetwork | null> {
    return this.repository.findOne({
      where: { partnerHostId, default: true },
    });
  }

  async setDefaultNetwork(
    partnerHostId: string,
    networkId: string,
  ): Promise<void> {
    // First, unset all default networks for this partner host
    await this.repository.update({ partnerHostId }, { default: false });

    // Then set the specified network as default
    await this.repository.update({ id: networkId }, { default: true });
  }

  async getNetworkStats(): Promise<any> {
    return this.repository
      .createQueryBuilder('network')
      .select('network.network', 'network')
      .addSelect('COUNT(*)', 'count')
      .addSelect(
        'COUNT(CASE WHEN network.default = true THEN 1 END)',
        'defaultCount',
      )
      .groupBy('network.network')
      .getRawMany();
  }
}
