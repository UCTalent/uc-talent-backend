import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('educations')
export class Education extends BaseEntity {
  @Column()
  talentId: string;

  @Column()
  institution: string;

  @Column({ nullable: true })
  degree: string;

  @Column({ nullable: true })
  fieldOfStudy: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: false })
  current: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.educations)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;
} 