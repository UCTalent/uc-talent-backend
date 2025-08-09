import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';

import { Job } from '@domains/job/entities/job.entity';
import type { CreatePartnerDto } from '@domains/partner/dtos/create-partner.dto';
import type { CreatePartnerHostDto } from '@domains/partner/dtos/create-partner-host.dto';
import type {
  CreatePartnerNetworkDto,
  UpdatePartnerNetworkDto,
} from '@domains/partner/dtos/partner-network.dto';
import type {
  PartnerHostQueryDto,
  PartnerQueryDto,
} from '@domains/partner/dtos/partner-query.dto';
import type { UpdatePartnerDto } from '@domains/partner/dtos/update-partner.dto';
import { UpdatePartnerHostDto } from '@domains/partner/dtos/update-partner-host.dto';
import type { Partner } from '@domains/partner/entities/partner.entity';
import type { PartnerHost } from '@domains/partner/entities/partner-host.entity';
import type {
  NetworkType,
  PartnerHostNetwork,
} from '@domains/partner/entities/partner-host-network.entity';
import { PartnerRepository } from '@domains/partner/repositories/partner.repository';
import { PartnerHostRepository } from '@domains/partner/repositories/partner-host.repository';
import { PartnerHostNetworkRepository } from '@domains/partner/repositories/partner-host-network.repository';

@Injectable()
export class PartnerService {
  constructor(
    private readonly partnerRepository: PartnerRepository,
    private readonly partnerHostRepository: PartnerHostRepository,
    private readonly partnerHostNetworkRepository: PartnerHostNetworkRepository
  ) {}

  // Partner Management
  async getPartners(query: PartnerQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      isUcTalent,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    const { data: partners, total } =
      await this.partnerRepository.findWithFilters({
        search,
        isUcTalent,
        sortBy,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        skip,
        take: limit,
      });

    return {
      success: true,
      data: {
        partners,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getPartnerById(id: string) {
    const partner = await this.partnerRepository.findByIdWithHosts(id);

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return {
      success: true,
      data: partner,
    };
  }

  async createPartner(createDto: CreatePartnerDto) {
    const existingPartner = await this.partnerRepository.findBySlug(
      createDto.slug
    );
    if (existingPartner) {
      throw new BadRequestException('Partner with this slug already exists');
    }

    const partner = await this.partnerRepository.create(createDto);
    return {
      success: true,
      data: partner,
    };
  }

  async updatePartner(id: string, updateDto: UpdatePartnerDto) {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    if (updateDto.slug && updateDto.slug !== partner.slug) {
      const existingPartner = await this.partnerRepository.findBySlug(
        updateDto.slug
      );
      if (existingPartner) {
        throw new BadRequestException('Partner with this slug already exists');
      }
    }

    const updatedPartner = await this.partnerRepository.update(id, updateDto);
    return {
      success: true,
      data: updatedPartner,
    };
  }

  async deletePartner(id: string) {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    await this.partnerRepository.softDelete(id);
    return {
      success: true,
      message: 'Partner deleted successfully',
    };
  }

  // Partner Host Management
  async getPartnerHosts(query: PartnerHostQueryDto) {
    const {
      page = 1,
      limit = 20,
      partnerId,
      host,
      isUcTalent,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    const { data: partnerHosts, total } =
      await this.partnerHostRepository.findWithFilters({
        search: host, // Use host as search parameter
        partnerId,
        isUcTalent,
        sortBy,
        sortOrder: sortOrder as 'ASC' | 'DESC',
        skip,
        take: limit,
      });

    return {
      success: true,
      data: {
        partnerHosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getPartnerHostById(id: string) {
    const partnerHost = await this.partnerHostRepository.findByIdWithJobs(id);

    if (!partnerHost) {
      throw new NotFoundException('Partner host not found');
    }

    return {
      success: true,
      data: partnerHost,
    };
  }

  async createPartnerHost(createDto: CreatePartnerHostDto) {
    const existingHost = await this.partnerHostRepository.findByHost(
      createDto.host
    );
    if (existingHost) {
      throw new BadRequestException(
        'Partner host with this host already exists'
      );
    }

    const existingSlug = await this.partnerHostRepository.findBySlug(
      createDto.slug
    );
    if (existingSlug) {
      throw new BadRequestException(
        'Partner host with this slug already exists'
      );
    }

    const accessToken = await this.partnerHostRepository.generateAccessToken();

    // Exclude networks from createDto when creating PartnerHost
    const { networks, ...hostData } = createDto;
    const partnerHost = await this.partnerHostRepository.create({
      ...hostData,
      accessToken,
    });

    if (networks && networks.length > 0) {
      const networkEntities = networks.map((network) => ({
        network: network.network as NetworkType,
        default: network.default || false,
        partnerHostId: partnerHost.id,
      }));

      await Promise.all(
        networkEntities.map((network) =>
          this.partnerHostNetworkRepository.create(network)
        )
      );
    }

    return {
      success: true,
      data: await this.getPartnerHostById(partnerHost.id),
    };
  }

  async regenerateAccessToken(id: string) {
    const partnerHost = await this.partnerHostRepository.findById(id);
    if (!partnerHost) {
      throw new NotFoundException('Partner host not found');
    }

    const newAccessToken =
      await this.partnerHostRepository.generateAccessToken();
    const updatedPartnerHost = await this.partnerHostRepository.update(id, {
      accessToken: newAccessToken,
    });

    return {
      success: true,
      data: {
        id: updatedPartnerHost.id,
        accessToken: newAccessToken,
        updatedAt: updatedPartnerHost.updatedAt,
      },
    };
  }

  // Partner Network Management
  async getPartnerNetworks(partnerHostId: string) {
    const networks =
      await this.partnerHostNetworkRepository.findByPartnerHost(partnerHostId);
    return {
      success: true,
      data: {
        networks,
      },
    };
  }

  async addNetworkToPartnerHost(
    partnerHostId: string,
    createDto: CreatePartnerNetworkDto
  ) {
    const partnerHost =
      await this.partnerHostRepository.findById(partnerHostId);
    if (!partnerHost) {
      throw new NotFoundException('Partner host not found');
    }

    const existingNetwork =
      await this.partnerHostNetworkRepository.findByNetwork(
        partnerHostId,
        createDto.network as NetworkType
      );
    if (existingNetwork) {
      throw new BadRequestException(
        'Network already exists for this partner host'
      );
    }

    if (createDto.default) {
      await this.partnerHostNetworkRepository.setDefaultNetwork(
        partnerHostId,
        ''
      );
    }

    const network = await this.partnerHostNetworkRepository.create({
      network: createDto.network as NetworkType,
      default: createDto.default || false,
      partnerHostId,
    });

    return {
      success: true,
      data: network,
    };
  }

  async updatePartnerNetwork(
    partnerHostId: string,
    networkId: string,
    updateDto: UpdatePartnerNetworkDto
  ) {
    const network = await this.partnerHostNetworkRepository.findById(networkId);
    if (!network || network.partnerHostId !== partnerHostId) {
      throw new NotFoundException('Network not found');
    }

    if (updateDto.default) {
      await this.partnerHostNetworkRepository.setDefaultNetwork(
        partnerHostId,
        networkId
      );
    }

    const updatedNetwork = await this.partnerHostNetworkRepository.update(
      networkId,
      updateDto
    );
    return {
      success: true,
      data: updatedNetwork,
    };
  }

  // Partner Authentication
  async validatePartnerToken(token: string, host: string) {
    const partnerHost =
      await this.partnerHostRepository.findByAccessToken(token);

    if (!partnerHost || partnerHost.host !== host) {
      throw new BadRequestException('Invalid partner token or host');
    }

    return {
      success: true,
      data: {
        partnerHost: {
          id: partnerHost.id,
          host: partnerHost.host,
          slug: partnerHost.slug,
          isUcTalent: partnerHost.isUcTalent,
        },
        partner: {
          id: partnerHost.partner.id,
          name: partnerHost.partner.name,
          slug: partnerHost.partner.slug,
        },
        permissions: {
          canPostJobs: true,
          canReadJobs: true,
          canUpdateJobs: true,
        },
      },
    };
  }

  // Legacy methods for backward compatibility
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

  async findPartnerHostNetworksByHostId(
    partnerHostId: string
  ): Promise<PartnerHostNetwork[]> {
    return this.partnerHostNetworkRepository.findByPartnerHostId(partnerHostId);
  }
}
