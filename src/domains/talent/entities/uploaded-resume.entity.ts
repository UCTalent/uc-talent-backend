import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

export enum ResumeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('uploaded_resumes')
export class UploadedResume extends BaseEntity {
  @Column()
  talentId: string;

  @Column()
  resumeFile: string;

  @Column({
    type: 'enum',
    enum: ResumeStatus,
    default: ResumeStatus.ACTIVE,
  })
  status: ResumeStatus;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.uploadedResumes)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;
} 