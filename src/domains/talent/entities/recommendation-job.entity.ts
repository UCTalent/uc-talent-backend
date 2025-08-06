import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';
import { Job } from '@job/entities/job.entity';

@Entity('recommendation_jobs')
export class RecommendationJob extends BaseEntity {
  @Column()
  talentId: string;

  @Column()
  jobId: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ type: 'jsonb', nullable: true })
  matchReasons: Record<string, any>;

  @Column({ default: false })
  isViewed: boolean;

  @Column({ default: false })
  isApplied: boolean;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.recommendationJobs)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'jobId' })
  job: Job;
} 