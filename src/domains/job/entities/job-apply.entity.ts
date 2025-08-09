import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from '@talent/entities/talent.entity';
import { UploadedResume } from '@talent/entities/uploaded-resume.entity';

import { Job } from './job.entity';
import { JobReferral } from './job-referral.entity';

export enum JobApplyStatus {
  NEW = 'new',
  EMAIL_SENT = 'email_sent',
  UNDER_REVIEW = 'under_review',
  INTERVIEWING = 'interviewing',
  OFFERING = 'offering',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

@Entity('job_applies')
export class JobApply extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'uploaded_resume_id', nullable: true })
  uploadedResumeId: string;

  @Column({
    type: 'enum',
    enum: JobApplyStatus,
    default: JobApplyStatus.NEW,
  })
  status: JobApplyStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'job_referral_id', nullable: true })
  jobReferralId: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  personalSign: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.jobApplies)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Talent)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => UploadedResume, { nullable: true })
  @JoinColumn({ name: 'uploaded_resume_id' })
  uploadedResume: UploadedResume;

  @ManyToOne(() => JobReferral, { nullable: true })
  @JoinColumn({ name: 'job_referral_id' })
  jobReferral: JobReferral;
}
