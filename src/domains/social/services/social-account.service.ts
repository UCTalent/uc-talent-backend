import { Injectable, NotFoundException } from '@nestjs/common';
import { SocialAccount } from '@social/entities/social-account.entity';
import { SocialAccountRepository } from '@social/repositories/social-account.repository';

@Injectable()
export class SocialAccountService {
  constructor(
    private readonly socialAccountRepository: SocialAccountRepository,
  ) {}

  async createSocialAccount(data: Partial<SocialAccount>): Promise<SocialAccount> {
    return this.socialAccountRepository.create(data);
  }

  async findSocialAccountById(id: string): Promise<SocialAccount> {
    const socialAccount = await this.socialAccountRepository.findById(id);
    
    if (!socialAccount) {
      throw new NotFoundException('Social account not found');
    }
    
    return socialAccount;
  }

  async findSocialAccountsByUserId(userId: string): Promise<SocialAccount[]> {
    return this.socialAccountRepository.findByUserId(userId);
  }

  async findSocialAccountByProviderAndUid(provider: string, uid: string): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findByProviderAndUid(provider, uid);
  }

  async deleteSocialAccount(id: string): Promise<void> {
    const socialAccount = await this.findSocialAccountById(id);
    await this.socialAccountRepository.delete(id);
  }
} 