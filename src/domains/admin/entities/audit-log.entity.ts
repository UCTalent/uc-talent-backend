import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Admin } from './admin.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  action: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'target_type', nullable: true })
  targetType: string;

  @Column({ name: 'target_id', nullable: true })
  targetId: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  // Relationships
  @ManyToOne(() => Admin, admin => admin.auditLogs)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
