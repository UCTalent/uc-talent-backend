import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('experiences')
export class Experience extends BaseEntity {
  @Column()
  talentId: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: false })
  current: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  jobType: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.experiences)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;
} 