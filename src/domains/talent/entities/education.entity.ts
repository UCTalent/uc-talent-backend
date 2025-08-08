import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('educations')
export class Education extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'institution_name' })
  institution: string;

  @Column({ name: 'degree_name', nullable: true })
  degree: string;

  @Column({ name: 'field_of_study', nullable: true })
  fieldOfStudy: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_current', default: false })
  current: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // Relationships
  @ManyToOne(() => Talent, talent => talent.educations)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
