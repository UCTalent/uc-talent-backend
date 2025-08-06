import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

@Entity('wallet_addresses')
export class WalletAddress extends BaseEntity {
  @Column()
  ownerType: string;

  @Column()
  ownerId: string;

  @Column()
  address: string;

  @Column()
  chainName: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.walletAddresses)
  @JoinColumn({ name: 'ownerId' })
  owner: User;
} 