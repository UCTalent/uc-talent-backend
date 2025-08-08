import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  SocialAccount,
  SocialProvider,
  SocialAccountStatus,
} from '@domains/social/entities/social-account.entity';
import { SocialSetting } from '@domains/social/entities/social-setting.entity';
import { SyncStatus } from '@domains/social/entities/social-sync-log.entity';
import { User } from '@domains/user/entities/user.entity';
import { SocialAccountRepository } from '@domains/social/repositories/social-account.repository';
import { SocialSettingRepository } from '@domains/social/repositories/social-setting.repository';
import { SocialSyncLogRepository } from '@domains/social/repositories/social-sync-log.repository';
import { UserRepository } from '@domains/user/repositories/user.repository';
import { LinkSocialAccountDto } from '@domains/social/dtos/link-social-account.dto';
import { SocialSettingsDto } from '@domains/social/dtos/social-settings.dto';
import { SocialSearchDto } from '@domains/social/dtos/social-search.dto';

@Injectable()
export class SocialAccountService {
  constructor(
    private readonly socialAccountRepository: SocialAccountRepository,
    private readonly socialSettingRepository: SocialSettingRepository,
    private readonly socialSyncLogRepository: SocialSyncLogRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getUserSocialAccounts(userId: string) {
    const socialAccounts =
      await this.socialAccountRepository.findByUser(userId);

    return {
      success: true,
      data: { socialAccounts },
    };
  }

  async linkSocialAccount(userId: string, linkDto: LinkSocialAccountDto) {
    // Check if social account already exists
    const existingAccount =
      await this.socialAccountRepository.findByProviderAndUid(
        linkDto.provider as SocialProvider,
        linkDto.uid,
      );

    if (existingAccount) {
      throw new BadRequestException('This social account is already linked');
    }

    // Check if user already has account for this provider
    const userExistingAccount =
      await this.socialAccountRepository.findByUserAndProvider(
        userId,
        linkDto.provider as SocialProvider,
      );

    const socialAccount = userExistingAccount || new SocialAccount();

    Object.assign(socialAccount, {
      ...linkDto,
      userId,
      provider: linkDto.provider as SocialProvider,
      status: SocialAccountStatus.ACTIVE,
      lastSyncedAt: new Date(),
      expiresAt: linkDto.expiresAt ? new Date(linkDto.expiresAt) : null,
    });

    const savedAccount =
      await this.socialAccountRepository.create(socialAccount);

    return {
      success: true,
      data: { socialAccount: savedAccount },
    };
  }

  async unlinkSocialAccount(userId: string, socialAccountId: string) {
    const socialAccount =
      await this.socialAccountRepository.findById(socialAccountId);

    if (!socialAccount || socialAccount.userId !== userId) {
      throw new NotFoundException('Social account not found');
    }

    await this.socialAccountRepository.delete(socialAccountId);

    return {
      success: true,
      message: 'Social account unlinked successfully',
    };
  }

  async syncSocialAccount(userId: string, socialAccountId: string) {
    const socialAccount =
      await this.socialAccountRepository.findById(socialAccountId);

    if (!socialAccount || socialAccount.userId !== userId) {
      throw new NotFoundException('Social account not found');
    }

    const startTime = Date.now();

    try {
      // Refresh token if needed
      if (this.isTokenExpired(socialAccount)) {
        await this.refreshAccessToken(socialAccount);
      }

      // Mock fetching latest data from provider
      const latestData = await this.fetchProfileDataFromProvider(socialAccount);

      const oldMetadata = socialAccount.metadata || {};
      const changes = this.detectChanges(oldMetadata, latestData);

      // Update social account
      socialAccount.metadata = latestData;
      socialAccount.lastSyncedAt = new Date();
      await this.socialAccountRepository.update(socialAccount.id, {
        metadata: latestData,
        lastSyncedAt: socialAccount.lastSyncedAt,
      });

      // Log sync
      await this.socialSyncLogRepository.logSync({
        socialAccountId: socialAccount.id,
        status: SyncStatus.SUCCESS,
        syncType: 'manual',
        changesCount: changes.length,
        changes,
        syncDurationMs: Date.now() - startTime,
      });

      return {
        success: true,
        data: {
          syncedAt: socialAccount.lastSyncedAt,
          syncedData: latestData,
          changes,
        },
      };
    } catch (error) {
      // Log failed sync
      await this.socialSyncLogRepository.logSync({
        socialAccountId: socialAccount.id,
        status: SyncStatus.FAILED,
        syncType: 'manual',
        errorMessage: error.message,
        syncDurationMs: Date.now() - startTime,
      });

      throw error;
    }
  }

  async syncAllSocialAccounts(userId: string) {
    const socialAccounts =
      await this.socialAccountRepository.findActiveByUser(userId);

    const syncResults = await Promise.allSettled(
      socialAccounts.map(account => this.syncSocialAccount(userId, account.id)),
    );

    const results = syncResults.map((result, index) => ({
      socialAccountId: socialAccounts[index].id,
      provider: socialAccounts[index].provider,
      status: result.status === 'fulfilled' ? 'success' : 'failed',
      syncedAt: result.status === 'fulfilled' ? new Date() : null,
      changesCount:
        result.status === 'fulfilled'
          ? (result.value as any).data?.changes?.length || 0
          : 0,
      error: result.status === 'rejected' ? result.reason?.message : null,
    }));

    const summary = {
      totalAccounts: socialAccounts.length,
      successfulSyncs: results.filter(r => r.status === 'success').length,
      failedSyncs: results.filter(r => r.status === 'failed').length,
      totalChanges: results.reduce((sum, r) => sum + (r.changesCount || 0), 0),
    };

    return {
      success: true,
      data: { syncResults: results, summary },
    };
  }

  async refreshSocialToken(userId: string, socialAccountId: string) {
    const socialAccount =
      await this.socialAccountRepository.findById(socialAccountId);

    if (!socialAccount || socialAccount.userId !== userId) {
      throw new NotFoundException('Social account not found');
    }

    if (!socialAccount.refreshToken) {
      throw new BadRequestException('No refresh token available');
    }

    // Mock token refresh (in real implementation, use OAuth service)
    const newTokens = await this.mockRefreshToken(socialAccount);

    await this.socialAccountRepository.update(socialAccount.id, {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresAt: newTokens.expiresAt,
    });

    return {
      success: true,
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresAt: newTokens.expiresAt,
        updatedAt: new Date(),
      },
    };
  }

  async searchSocialProfiles(searchDto: SocialSearchDto) {
    const { query, provider, page = 1, limit = 20 } = searchDto;
    const skip = (page - 1) * limit;

    let socialAccounts: SocialAccount[] = [];

    if (query) {
      socialAccounts = await this.socialAccountRepository.searchByMetadata(
        query,
        provider as SocialProvider,
      );
    } else if (provider) {
      socialAccounts = await this.socialAccountRepository.findByProvider(
        provider as SocialProvider,
      );
    } else {
      socialAccounts = await this.socialAccountRepository.findAll();
    }

    // Apply pagination
    const paginatedAccounts = socialAccounts.slice(skip, skip + limit);

    const profiles = paginatedAccounts.map(account => ({
      userId: account.userId,
      user: {
        firstName: account.user?.name?.split(' ')[0],
        lastName: account.user?.name?.split(' ')[1],
        email: account.metadata?.email || account.user?.email,
      },
      socialAccounts: [
        {
          provider: account.provider,
          metadata: account.metadata,
        },
      ],
    }));

    return {
      success: true,
      data: {
        profiles,
        pagination: {
          page,
          limit,
          total: socialAccounts.length,
          totalPages: Math.ceil(socialAccounts.length / limit),
        },
      },
    };
  }

  async getSocialSettings(userId: string) {
    const settings =
      await this.socialSettingRepository.findOrCreateByUser(userId);

    return {
      success: true,
      data: {
        privacySettings: {
          showLinkedInProfile: settings.showLinkedInProfile,
          showGitHubRepos: settings.showGitHubRepos,
          showSocialConnections: settings.showSocialConnections,
          allowProfileSync: settings.allowProfileSync,
          publicSocialLinks: settings.publicSocialLinks,
        },
        syncSettings: {
          autoSync: settings.autoSync,
          syncFrequency: settings.syncFrequency,
          syncFields: settings.syncFields,
        },
      },
    };
  }

  async updateSocialSettings(userId: string, settingsDto: SocialSettingsDto) {
    const settings =
      await this.socialSettingRepository.findOrCreateByUser(userId);

    if (settingsDto.privacySettings) {
      Object.assign(settings, settingsDto.privacySettings);
    }

    if (settingsDto.syncSettings) {
      Object.assign(settings, settingsDto.syncSettings);
    }

    const updatedSettings = await this.socialSettingRepository.update(
      settings.id,
      settings,
    );

    return {
      success: true,
      data: {
        privacySettings: {
          showLinkedInProfile: updatedSettings.showLinkedInProfile,
          showGitHubRepos: updatedSettings.showGitHubRepos,
          showSocialConnections: updatedSettings.showSocialConnections,
          allowProfileSync: updatedSettings.allowProfileSync,
          publicSocialLinks: updatedSettings.publicSocialLinks,
        },
        syncSettings: {
          autoSync: updatedSettings.autoSync,
          syncFrequency: updatedSettings.syncFrequency,
          syncFields: updatedSettings.syncFields,
        },
        updatedAt: updatedSettings.updatedAt,
      },
    };
  }

  // Helper methods
  private isTokenExpired(socialAccount: SocialAccount): boolean {
    if (!socialAccount.expiresAt) return false;
    return new Date() >= socialAccount.expiresAt;
  }

  private async refreshAccessToken(socialAccount: SocialAccount) {
    if (!socialAccount.refreshToken) {
      throw new BadRequestException('No refresh token available');
    }

    const newTokens = await this.mockRefreshToken(socialAccount);

    socialAccount.accessToken = newTokens.accessToken;
    socialAccount.refreshToken = newTokens.refreshToken;
    socialAccount.expiresAt = newTokens.expiresAt;

    await this.socialAccountRepository.update(socialAccount.id, {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresAt: newTokens.expiresAt,
    });
  }

  private async fetchProfileDataFromProvider(
    socialAccount: SocialAccount,
  ): Promise<any> {
    // Mock implementation - in real scenario, use OAuth service
    const mockData = {
      displayName: `Mock User ${socialAccount.provider}`,
      email: `user@${socialAccount.provider}.com`,
      profileUrl: `https://${socialAccount.provider}.com/user`,
      connections: Math.floor(Math.random() * 1000),
      followers: Math.floor(Math.random() * 500),
      ...socialAccount.metadata,
    };

    return mockData;
  }

  private async mockRefreshToken(socialAccount: SocialAccount): Promise<any> {
    // Mock implementation - in real scenario, use OAuth service
    return {
      accessToken: `new-token-${Date.now()}`,
      refreshToken: `new-refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  private detectChanges(oldData: any, newData: any): any[] {
    const changes = [];

    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes.push({
          field: key,
          oldValue: oldData[key],
          newValue: newData[key],
        });
      }
    }

    return changes;
  }

  // Legacy methods for backward compatibility
  async createSocialAccount(
    data: Partial<SocialAccount>,
  ): Promise<SocialAccount> {
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
    return this.socialAccountRepository.findByUser(userId);
  }

  async findSocialAccountByProviderAndUid(
    provider: string,
    uid: string,
  ): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findByProviderAndUid(
      provider as SocialProvider,
      uid,
    );
  }

  async deleteSocialAccount(id: string): Promise<void> {
    const socialAccount = await this.findSocialAccountById(id);
    await this.socialAccountRepository.delete(id);
  }
}
