import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talent } from './entities/talent.entity';
import { Experience } from './entities/experience.entity';
import { Education } from './entities/education.entity';
import { ExternalLink } from './entities/external-link.entity';
import { UploadedResume } from './entities/uploaded-resume.entity';
import { RecommendationJob } from './entities/recommendation-job.entity';
import { TalentRepository } from './repositories/talent.repository';
import { TalentService } from './services/talent.service';
import { TalentController } from './controllers/talent.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Talent,
      Experience,
      Education,
      ExternalLink,
      UploadedResume,
      RecommendationJob,
    ]),
  ],
  providers: [TalentService, TalentRepository],
  controllers: [TalentController],
  exports: [TalentService, TalentRepository],
})
export class TalentModule {} 