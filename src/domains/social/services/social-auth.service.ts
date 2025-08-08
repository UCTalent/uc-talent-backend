import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialAccountService } from './social-account.service';
import { OAuthService } from './oauth.service';
import { SocialAuthDto } from '@domains/social/dtos/social-auth.dto';
import { SocialProvider } from '@domains/social/entities/social-account.entity';
import { User } from '@domains/user/entities/user.entity';
import { UserRepository } from '@domains/user/repositories/user.repository';

@Injectable()
export class SocialAuthService {
  constructor(
    private readonly socialAccountService: SocialAccountService,
    private readonly oauthService: OAuthService,
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async authenticateWithSocial(provider: string, authDto: SocialAuthDto) {
    // Exchange code for access token
    const tokenData = await this.oauthService.exchangeCodeForToken(
      provider,
      authDto.code,
      authDto.redirectUri,
    );

    // Fetch user profile from provider
    const profileData = await this.oauthService.fetchProfileData(
      provider,
      tokenData.accessToken,
    );

    // Find or create user
    let user = await this.findUserBySocialAccount(provider, profileData.id);
    let isNewUser = false;

    if (!user) {
      user = await this.createUserFromSocialProfile(profileData);
      isNewUser = true;
    }

    // Link or update social account
    await this.socialAccountService.linkSocialAccount(user.id, {
      provider,
      uid: profileData.id,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: tokenData.expiresAt?.toISOString(),
      metadata: profileData,
    });

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isNewUser,
        },
        tokens,
        socialAccount: {
          provider,
          uid: profileData.id,
          status: 'active',
        },
      },
    };
  }

  private async findUserBySocialAccount(
    provider: string,
    uid: string,
  ): Promise<User | null> {
    const socialAccount =
      await this.socialAccountService.findSocialAccountByProviderAndUid(
        provider,
        uid,
      );

    if (socialAccount) {
      return this.userRepo.findById(socialAccount.userId);
    }

    return null;
  }

  private async createUserFromSocialProfile(profile: any): Promise<User> {
    const userData = {
      email: profile.email,
      name:
        profile.displayName ||
        `${profile.firstName} ${profile.lastName}`.trim(),
      // Add other user fields as needed based on your User entity
    };

    return this.userRepo.create(userData);
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 3600,
    };
  }
}
