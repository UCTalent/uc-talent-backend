import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

@Entity('system_settings')
export class SystemSetting extends BaseEntity {
  @Column({ unique: true })
  @Index()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'string' })
  type: string; // string, number, boolean, json

  @Column({ default: false })
  encrypted: boolean;
}
