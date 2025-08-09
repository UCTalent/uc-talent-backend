import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Job } from '@job/entities/job.entity';
import { JobModule } from '@job/job.module';

import { OrganizationController } from './controllers/organization.controller';
import { Industry } from './entities/industry.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationService } from './services/organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Industry, Job]), JobModule],
  providers: [OrganizationService, OrganizationRepository],
  controllers: [OrganizationController],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
