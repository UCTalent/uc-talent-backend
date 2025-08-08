import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  // Relationships
  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'userId' })
  user: User;
}
