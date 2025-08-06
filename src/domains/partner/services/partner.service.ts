import { Injectable } from '@nestjs/common';
import { Partner } from '@partner/entities/partner.entity';
import { PartnerHost } from '@partner/entities/partner-host.entity';
import { PartnerHostNetwork } from '@partner/entities/partner-host-network.entity';
import { PartnerRepository } from '@partner/repositories/partner.repository';
import { PartnerHostRepository } from '@partner/repositories/partner-host.repository';
import { PartnerHostNetworkRepository } from '@partner/repositories/partner-host-network.repository';

@Injectable()
export class PartnerService {
  constructor(
    private readonly partnerRepository: PartnerRepository,
    private readonly partnerHostRepository: PartnerHostRepository,
    private readonly partnerHostNetworkRepository: PartnerHostNetworkRepository,
  ) {}

  async findAllPartners(): Promise<Partner[]> {
    return this.partnerRepository.findAll();
  }

  async findPartnerById(id: string): Promise<Partner | null> {
    return this.partnerRepository.findById(id);
  }

  async findAllPartnerHosts(): Promise<PartnerHost[]> {
    return this.partnerHostRepository.findAll();
  }

  async findPartnerHostById(id: string): Promise<PartnerHost | null> {
    return this.partnerHostRepository.findById(id);
  }

  async findPartnerHostByHost(host: string): Promise<PartnerHost | null> {
    return this.partnerHostRepository.findByHost(host);
  }

  async findAllPartnerHostNetworks(): Promise<PartnerHostNetwork[]> {
    return this.partnerHostNetworkRepository.findAll();
  }

  async findPartnerHostNetworksByHostId(partnerHostId: string): Promise<PartnerHostNetwork[]> {
    return this.partnerHostNetworkRepository.findByPartnerHostId(partnerHostId);
  }
} 