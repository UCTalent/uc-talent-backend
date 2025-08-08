import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletAddress } from '../entities/wallet-address.entity';
import { WalletAddressRepository } from '../repositories/wallet-address.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletAddressRepo: WalletAddressRepository) {}

  async createWalletAddress(
    data: Partial<WalletAddress>,
  ): Promise<WalletAddress> {
    return this.walletAddressRepo.create(data);
  }

  async findWalletAddressById(id: string): Promise<WalletAddress> {
    const wallet = await this.walletAddressRepo.findById(id);

    if (!wallet) {
      throw new NotFoundException('Wallet address not found');
    }

    return wallet;
  }

  async findWalletAddressesByOwner(ownerId: string): Promise<WalletAddress[]> {
    return this.walletAddressRepo.findByOwner(ownerId);
  }

  async findWalletAddressByAddress(
    address: string,
  ): Promise<WalletAddress | null> {
    return this.walletAddressRepo.findByAddress(address);
  }

  async deleteWalletAddress(id: string): Promise<void> {
    const wallet = await this.findWalletAddressById(id);
    await this.walletAddressRepo.delete(id);
  }
}
