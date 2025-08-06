import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Industry } from './entities/industry.entity';
import { Job } from '@job/entities/job.entity';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Industry, Job])],
  providers: [OrganizationService, OrganizationRepository],
  controllers: [OrganizationController],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {} 