import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { Admin } from './admin.entity';

@Entity('admin_permissions')
export class AdminPermission extends BaseEntity {
  @Column({ unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  resource: string; // users, jobs, talents, payments

  @Column()
  action: string; // create, read, update, delete

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToMany(() => Admin, (admin) => admin.permissions)
  @JoinTable({
    name: 'admin_permission_mappings',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'admin_id', referencedColumnName: 'id' },
  })
  admins: Admin[];
}
