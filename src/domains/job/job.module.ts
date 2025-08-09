import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobController } from './controllers/job.controller';
import { ChoiceOption } from './entities/choice-option.entity';
import { Job } from './entities/job.entity';
import { JobApply } from './entities/job-apply.entity';
import { JobClosureReason } from './entities/job-closure-reason.entity';
import { JobReferral } from './entities/job-referral.entity';
import { ReferralLink } from './entities/referral-link.entity';
import { Web3Event } from './entities/web3-event.entity';
import { JobRepository } from './repositories/job.repository';
import { JobApplyRepository } from './repositories/job-apply.repository';
import { JobReferralRepository } from './repositories/job-referral.repository';
import { ReferralLinkRepository } from './repositories/referral-link.repository';
import { JobService } from './services/job.service';

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
