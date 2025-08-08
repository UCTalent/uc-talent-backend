import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';
import { Talent } from '@talent/entities/talent.entity';
import { UploadedResume } from '@talent/entities/uploaded-resume.entity';
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
  @Column()
  jobId: string;

  @Column()
  talentId: string;

  @Column({ nullable: true })
  uploadedResumeId: string;

  @Column({
    type: 'enum',
    enum: JobApplyStatus,
    default: JobApplyStatus.NEW,
  })
  status: JobApplyStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  jobReferralId: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  personalSign: string;

  // Relationships
  @ManyToOne(() => Job, job => job.jobApplies)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Talent)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;

  @ManyToOne(() => UploadedResume, { nullable: true })
  @JoinColumn({ name: 'uploadedResumeId' })
  uploadedResume: UploadedResume;

  @ManyToOne(() => JobReferral, { nullable: true })
  @JoinColumn({ name: 'jobReferralId' })
  jobReferral: JobReferral;
}
