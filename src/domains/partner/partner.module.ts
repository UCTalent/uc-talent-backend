import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { PartnerHost } from './entities/partner-host.entity';
import { PartnerHostNetwork } from './entities/partner-host-network.entity';
import { Job } from '@domains/job/entities/job.entity';
import { PartnerService } from './services/partner.service';
import { PartnerRepository } from './repositories/partner.repository';
import { PartnerHostRepository } from './repositories/partner-host.repository';
import { PartnerHostNetworkRepository } from './repositories/partner-host-network.repository';
import { PartnerTokenGuard } from './guards/partner-token.guard';
import {
  PartnerController,
  PartnerHostController,
  PartnerAuthController,
} from './controllers/partner.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Partner,
      PartnerHost,
      PartnerHostNetwork,
      Job, // Include Job entity for service dependencies
    ]),
  ],
  controllers: [
    PartnerController,
    PartnerHostController,
    PartnerAuthController,
  ],
  providers: [
    PartnerService,
    PartnerRepository,
    PartnerHostRepository,
    PartnerHostNetworkRepository,
    PartnerTokenGuard,
  ],
  exports: [
    PartnerService,
    PartnerRepository,
    PartnerHostRepository,
    PartnerHostNetworkRepository,
    PartnerTokenGuard,
  ],
})
export class PartnerModule {}
