import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';
import { Job } from '@job/entities/job.entity';

@Entity('recommendation_jobs')
export class RecommendationJob extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'match_score', type: 'float', default: 0 })
  score: number;

  @Column({ name: 'match_reasons', type: 'jsonb', nullable: true })
  matchReasons: Record<string, any>;

  @Column({ name: 'is_viewed', default: false })
  isViewed: boolean;

  @Column({ name: 'is_applied', default: false })
  isApplied: boolean;

  // Relationships
  @ManyToOne(() => Talent, talent => talent.recommendationJobs)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
