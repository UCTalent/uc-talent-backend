import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { Job } from '@job/entities/job.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
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
