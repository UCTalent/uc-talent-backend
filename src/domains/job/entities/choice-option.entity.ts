import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';

@Entity('choice_options')
export class ChoiceOption extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
