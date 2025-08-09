import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IOAuthService {
  exchangeCodeForToken(
    provider: string,
    code: string,
    redirectUri?: string
  ): Promise<any>;
  refreshToken(provider: string, refreshToken: string): Promise<any>;
  fetchProfileData(provider: string, accessToken: string): Promise<any>;
  revokeToken(provider: string, token: string): Promise<boolean>;
}

@Injectable()
export class OAuthService implements IOAuthService {
  constructor(private readonly configService: ConfigService) {}

  async exchangeCodeForToken(
    provider: string,
    code: string,
    redirectUri?: string
  ): Promise<any> {
    // Mock implementation - replace with actual OAuth implementation when needed
    return {
      accessToken: `mock_token_${provider}_${Date.now()}`,
      refreshToken: `mock_refresh_${provider}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  async refreshToken(provider: string, refreshToken: string): Promise<any> {
    // Mock implementation
    return {
      accessToken: `mock_refreshed_token_${provider}_${Date.now()}`,
      refreshToken: `mock_new_refresh_${provider}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000),
    };
  }

  async fetchProfileData(provider: string, accessToken: string): Promise<any> {
    // Mock implementation
    const mockProfiles = {
      linkedin: {
        id: `linkedin_${Date.now()}`,
        email: 'user@linkedin.com',
        displayName: 'LinkedIn User',
        firstName: 'LinkedIn',
        lastName: 'User',
        profileUrl: 'https://linkedin.com/in/user',
        pictureUrl: 'https://example.com/avatar.jpg',
        headline: 'Software Engineer',
        industry: 'Computer Software',
      },
      github: {
        id: `github_${Date.now()}`,
        email: 'user@github.com',
        displayName: 'GitHub User',
        firstName: 'GitHub',
        lastName: 'User',
        profileUrl: 'https://github.com/user',
        avatarUrl: 'https://github.com/avatar.jpg',
        bio: 'Full-stack developer',
        publicRepos: 25,
        followers: 150,
        following: 75,
      },
      facebook: {
        id: `facebook_${Date.now()}`,
        email: 'user@facebook.com',
        displayName: 'Facebook User',
        firstName: 'Facebook',
        lastName: 'User',
      },
      x: {
        id: `x_${Date.now()}`,
        email: 'user@x.com',
        displayName: 'X User',
        firstName: 'X',
        lastName: 'User',
      },
      twitter: {
        id: `twitter_${Date.now()}`,
        email: 'user@twitter.com',
        displayName: 'Twitter User',
        firstName: 'Twitter',
        lastName: 'User',
      },
    };

    return (
      mockProfiles[provider] || {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.com`,
        displayName: `${provider} User`,
        firstName: provider,
        lastName: 'User',
      }
    );
  }

  async revokeToken(provider: string, token: string): Promise<boolean> {
    // Mock implementation - always returns true
    return true;
  }

  // LinkedIn implementation (commented out - will be implemented when @nestjs/axios is available)
  /*
  private async linkedInExchangeCode(code: string, redirectUri?: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.configService.get('LINKEDIN_CLIENT_ID'),
          client_secret: this.configService.get('LINKEDIN_CLIENT_SECRET'),
          redirect_uri: redirectUri || this.configService.get('LINKEDIN_REDIRECT_URI')
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
      };
    } catch (error) {
      throw new BadRequestException('Failed to exchange LinkedIn code for token');
    }
  }
  */
}
