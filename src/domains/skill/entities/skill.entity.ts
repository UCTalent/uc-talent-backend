import { Entity, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from '@job/entities/job.entity';
import { Talent } from '@talent/entities/talent.entity';
import { Role } from './role.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  // Relationships
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
} 