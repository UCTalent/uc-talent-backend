import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Skill } from './skill.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => Skill, (skill) => skill.role)
  skills: Skill[];
} 