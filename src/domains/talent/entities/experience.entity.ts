import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('experiences')
export class Experience extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'job_title' })
  title: string;

  @Column({ name: 'company_name' })
  company: string;

  @Column({ name: 'location', nullable: true })
  location: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_current', default: false })
  current: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'job_type', nullable: true })
  jobType: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.experiences)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
} 