import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { AdminPermission } from './admin-permission.entity';
import { AdminSession } from './admin-session.entity';
import { AuditLog } from './audit-log.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  // Relationships
  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[];

  @OneToMany(() => AdminSession, (session) => session.admin)
  sessions: AdminSession[];

  @OneToMany(() => AdminPermission, (permission) => permission.admins)
  permissions: AdminPermission[];
}
