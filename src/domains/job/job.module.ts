import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobApply } from './entities/job-apply.entity';
import { JobReferral } from './entities/job-referral.entity';
import { JobClosureReason } from './entities/job-closure-reason.entity';
import { Web3Event } from './entities/web3-event.entity';
import { ChoiceOption } from './entities/choice-option.entity';
import { ReferralLink } from './entities/referral-link.entity';
import { JobRepository } from './repositories/job.repository';
import { JobApplyRepository } from './repositories/job-apply.repository';
import { JobReferralRepository } from './repositories/job-referral.repository';
import { ReferralLinkRepository } from './repositories/referral-link.repository';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobApply,
      JobReferral,
      JobClosureReason,
      Web3Event,
      ChoiceOption,
      ReferralLink,
    ]),
  ],
  providers: [
    JobService, 
    JobRepository,
    JobApplyRepository,
    JobReferralRepository,
    ReferralLinkRepository,
  ],
  controllers: [JobController],
  exports: [
    JobService, 
    JobRepository,
    JobApplyRepository,
    JobReferralRepository,
    ReferralLinkRepository,
  ],
})
export class JobModule {} 