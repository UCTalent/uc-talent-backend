import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

@Entity('social_accounts')
export class SocialAccount extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  provider: string;

  @Column()
  uid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.socialAccounts)
  @JoinColumn({ name: 'userId' })
  user: User;
} 