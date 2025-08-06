import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { PartnerHost } from './entities/partner-host.entity';
import { PartnerHostNetwork } from './entities/partner-host-network.entity';
import { PartnerService } from './services/partner.service';
import { PartnerRepository } from './repositories/partner.repository';
import { PartnerHostRepository } from './repositories/partner-host.repository';
import { PartnerHostNetworkRepository } from './repositories/partner-host-network.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, PartnerHost, PartnerHostNetwork])],
  providers: [
    PartnerService,
    PartnerRepository,
    PartnerHostRepository,
    PartnerHostNetworkRepository,
  ],
  exports: [PartnerService],
})
export class PartnerModule {} 