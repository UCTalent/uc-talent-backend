import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletAddress } from '../entities/wallet-address.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletAddress)
    private readonly walletAddressRepository: Repository<WalletAddress>,
  ) {}

  async createWalletAddress(data: Partial<WalletAddress>): Promise<WalletAddress> {
    const wallet = this.walletAddressRepository.create(data);
    return this.walletAddressRepository.save(wallet);
  }

  async findWalletAddressById(id: string): Promise<WalletAddress> {
    const wallet = await this.walletAddressRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    
    if (!wallet) {
      throw new NotFoundException('Wallet address not found');
    }
    
    return wallet;
  }

  async findWalletAddressesByOwner(ownerId: string): Promise<WalletAddress[]> {
    return this.walletAddressRepository.find({
      where: { ownerId },
      relations: ['owner'],
    });
  }

  async findWalletAddressByAddress(address: string): Promise<WalletAddress | null> {
    return this.walletAddressRepository.findOne({
      where: { address },
      relations: ['owner'],
    });
  }

  async deleteWalletAddress(id: string): Promise<void> {
    const wallet = await this.findWalletAddressById(id);
    await this.walletAddressRepository.remove(wallet);
  }
} 