import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletAddress } from '@payment/entities/wallet-address.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class WalletAddressRepository implements IBaseRepository<WalletAddress> {
  constructor(
    @InjectRepository(WalletAddress)
    private readonly repository: Repository<WalletAddress>,
  ) {}

  async findById(id: string): Promise<WalletAddress | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async findAll(): Promise<WalletAddress[]> {
    return this.repository.find({
      relations: ['owner'],
    });
  }

  async create(data: Partial<WalletAddress>): Promise<WalletAddress> {
    const walletAddress = this.repository.create(data);
    return this.repository.save(walletAddress);
  }

  async update(id: string, data: Partial<WalletAddress>): Promise<WalletAddress> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async findByOwner(ownerId: string): Promise<WalletAddress[]> {
    return this.repository.find({
      where: { ownerId },
      relations: ['owner'],
    });
  }

  async findByAddress(address: string): Promise<WalletAddress | null> {
    return this.repository.findOne({
      where: { address },
      relations: ['owner'],
    });
  }
} 