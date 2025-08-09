import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { Talent } from './talent.entity';

export enum ResumeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('uploaded_resumes')
export class UploadedResume extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'resume_file' })
  resumeFile: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ResumeStatus,
    default: ResumeStatus.ACTIVE,
  })
  status: ResumeStatus;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.uploadedResumes)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
