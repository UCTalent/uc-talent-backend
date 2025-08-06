import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Admin } from './admin.entity';

@Entity('admin_sessions')
export class AdminSession extends BaseEntity {
  @Column({ name: 'session_token' })
  @Index()
  sessionToken: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Admin, admin => admin.sessions)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
} 