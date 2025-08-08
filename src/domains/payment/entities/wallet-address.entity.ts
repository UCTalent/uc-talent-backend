import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

@Entity('wallet_addresses')
export class WalletAddress extends BaseEntity {
  @Column()
  address: string;

  @Column({ name: 'chain_name' })
  chainName: string;

  // Foreign Keys
  @Column({ name: 'owner_id' })
  ownerId: string;

  // Relationships
  @ManyToOne(() => User, user => user.walletAddresses)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
