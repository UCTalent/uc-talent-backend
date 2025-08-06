# Social Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic cho Social domain trong NestJS.

## 🏗️ Social Domain Architecture

### Core Features
- **Social Account Management**: Link/unlink social accounts
- **Social Authentication**: OAuth login với các providers
- **Account Synchronization**: Sync data từ social platforms
- **Profile Integration**: Integrate social data vào user profile
- **Privacy Management**: Control social data visibility

---

## 📱 Social Account Management

### 1. Get User Social Accounts

#### Endpoint: `GET /api/v1/social-accounts`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "socialAccounts": [
      {
        "id": "social-account-uuid",
        "provider": "linkedin",
        "uid": "linkedin-user-id",
        "status": "active",
        "lastSyncedAt": "2024-01-20T10:00:00Z",
        "expiresAt": "2024-12-31T23:59:59Z",
        "metadata": {
          "profileUrl": "https://linkedin.com/in/johndoe",
          "displayName": "John Doe",
          "email": "john@example.com",
          "pictureUrl": "https://media.licdn.com/dms/image/...",
          "headline": "Senior Software Engineer",
          "industry": "Computer Software",
          "connections": 500
        },
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z"
      },
      {
        "id": "social-account-uuid-2",
        "provider": "github",
        "uid": "github-user-id",
        "status": "active",
        "lastSyncedAt": "2024-01-20T09:00:00Z",
        "expiresAt": null,
        "metadata": {
          "profileUrl": "https://github.com/johndoe",
          "displayName": "John Doe",
          "email": "john@example.com",
          "avatarUrl": "https://avatars.githubusercontent.com/u/...",
          "bio": "Full-stack developer",
          "publicRepos": 25,
          "followers": 150,
          "following": 75
        },
        "createdAt": "2024-01-19T14:00:00Z",
        "updatedAt": "2024-01-20T09:00:00Z"
      }
    ]
  }
}
```

### 2. Link Social Account

#### Endpoint: `POST /api/v1/social-accounts/link`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}',
  'Content-Type': 'application/json'
}
```

#### Request Body
```json
{
  "provider": "linkedin",
  "uid": "linkedin-user-id",
  "accessToken": "oauth-access-token",
  "refreshToken": "oauth-refresh-token",
  "expiresAt": "2024-12-31T23:59:59Z",
  "metadata": {
    "profileUrl": "https://linkedin.com/in/johndoe",
    "displayName": "John Doe",
    "email": "john@example.com",
    "pictureUrl": "https://media.licdn.com/dms/image/...",
    "headline": "Senior Software Engineer",
    "industry": "Computer Software",
    "connections": 500
  }
}
```

#### Response Success (201)
```json
{
  "success": true,
  "data": {
    "socialAccount": {
      "id": "social-account-uuid",
      "provider": "linkedin",
      "uid": "linkedin-user-id",
      "status": "active",
      "lastSyncedAt": "2024-01-20T10:00:00Z",
      "expiresAt": "2024-12-31T23:59:59Z",
      "metadata": {
        "profileUrl": "https://linkedin.com/in/johndoe",
        "displayName": "John Doe",
        "email": "john@example.com",
        "pictureUrl": "https://media.licdn.com/dms/image/...",
        "headline": "Senior Software Engineer",
        "industry": "Computer Software",
        "connections": 500
      },
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### Response Error (422)
```json
{
  "success": false,
  "errors": [
    "This social account is already linked",
    "Provider must be one of: facebook, x, twitter, linkedin, github, instagram, discord, telegram"
  ]
}
```

### 3. Unlink Social Account

#### Endpoint: `DELETE /api/v1/social-accounts/:id/unlink`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (204)
```json
{
  "success": true,
  "message": "Social account unlinked successfully"
}
```

#### Response Error (404)
```json
{
  "success": false,
  "error": "Social account not found"
}
```

---

## 🔐 Social Authentication

### 1. Authenticate with Social Provider

#### Endpoint: `POST /api/v1/social-auth/{provider}`

#### Supported Providers
- `facebook`
- `x` (Twitter X)
- `twitter`
- `linkedin`
- `github`
- `instagram`
- `discord`
- `telegram`

#### Request Body
```json
{
  "code": "oauth-authorization-code",
  "state": "csrf-state-token",
  "redirectUri": "https://app.example.com/auth/callback"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isNewUser": false
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 3600
    },
    "socialAccount": {
      "id": "social-account-uuid",
      "provider": "linkedin",
      "uid": "linkedin-user-id",
      "status": "active"
    }
  }
}
```

### 2. Refresh Social Token

#### Endpoint: `POST /api/v1/social-accounts/:id/refresh-token`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "new-oauth-access-token",
    "refreshToken": "new-oauth-refresh-token",
    "expiresAt": "2024-12-31T23:59:59Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

---

## 🔄 Social Data Synchronization

### 1. Sync Social Account Data

#### Endpoint: `POST /api/v1/social-accounts/:id/sync`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "syncedAt": "2024-01-20T10:00:00Z",
    "syncedData": {
      "profile": {
        "displayName": "John Doe",
        "email": "john@example.com",
        "pictureUrl": "https://media.licdn.com/dms/image/...",
        "headline": "Senior Software Engineer"
      },
      "stats": {
        "connections": 520,
        "followers": 160,
        "publicRepos": 27
      }
    },
    "changes": [
      {
        "field": "connections",
        "oldValue": 500,
        "newValue": 520
      },
      {
        "field": "followers",
        "oldValue": 150,
        "newValue": 160
      }
    ]
  }
}
```

### 2. Bulk Sync All Social Accounts

#### Endpoint: `POST /api/v1/social-accounts/sync-all`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "syncResults": [
      {
        "socialAccountId": "social-account-uuid",
        "provider": "linkedin",
        "status": "success",
        "syncedAt": "2024-01-20T10:00:00Z",
        "changesCount": 2
      },
      {
        "socialAccountId": "social-account-uuid-2",
        "provider": "github",
        "status": "success",
        "syncedAt": "2024-01-20T10:00:00Z",
        "changesCount": 1
      }
    ],
    "summary": {
      "totalAccounts": 2,
      "successfulSyncs": 2,
      "failedSyncs": 0,
      "totalChanges": 3
    }
  }
}
```

---

## 🔍 Social Profile Search

### 1. Search Users by Social Profile

#### Endpoint: `GET /api/v1/social-accounts/search`

#### Query Parameters
```typescript
{
  provider?: string;      // Filter by provider
  query?: string;         // Search by display name, email
  skills?: string[];      // Filter by skills (from social profiles)
  location?: string;      // Filter by location
  industry?: string;      // Filter by industry (LinkedIn)
  page?: number;          // Default: 1
  limit?: number;         // Default: 20
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "userId": "user-uuid",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "socialAccounts": [
          {
            "provider": "linkedin",
            "metadata": {
              "displayName": "John Doe",
              "headline": "Senior Software Engineer",
              "industry": "Computer Software",
              "location": "San Francisco, CA",
              "connections": 520
            }
          },
          {
            "provider": "github",
            "metadata": {
              "displayName": "John Doe",
              "bio": "Full-stack developer",
              "publicRepos": 27,
              "followers": 160
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

## ⚙️ Social Settings Management

### 1. Get Social Privacy Settings

#### Endpoint: `GET /api/v1/social-accounts/settings`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}'
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "privacySettings": {
      "showLinkedInProfile": true,
      "showGitHubRepos": true,
      "showSocialConnections": false,
      "allowProfileSync": true,
      "publicSocialLinks": ["linkedin", "github"]
    },
    "syncSettings": {
      "autoSync": true,
      "syncFrequency": "daily",
      "syncFields": ["profile", "connections", "repos"]
    }
  }
}
```

### 2. Update Social Privacy Settings

#### Endpoint: `PATCH /api/v1/social-accounts/settings`

#### Headers
```typescript
{
  Authorization: 'Bearer {access_token}',
  'Content-Type': 'application/json'
}
```

#### Request Body
```json
{
  "privacySettings": {
    "showLinkedInProfile": false,
    "showGitHubRepos": true,
    "showSocialConnections": false,
    "allowProfileSync": true,
    "publicSocialLinks": ["github"]
  },
  "syncSettings": {
    "autoSync": false,
    "syncFrequency": "weekly",
    "syncFields": ["profile", "repos"]
  }
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "privacySettings": {
      "showLinkedInProfile": false,
      "showGitHubRepos": true,
      "showSocialConnections": false,
      "allowProfileSync": true,
      "publicSocialLinks": ["github"]
    },
    "syncSettings": {
      "autoSync": false,
      "syncFrequency": "weekly",
      "syncFields": ["profile", "repos"]
    },
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

---

## 📝 DTOs

### 1. Link Social Account DTO

```typescript
// link-social-account.dto.ts
export class LinkSocialAccountDto {
  @IsString()
  @IsIn(['facebook', 'x', 'twitter', 'linkedin', 'github', 'instagram', 'discord', 'telegram'])
  provider: string;

  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
```

### 2. Social Auth DTO

```typescript
// social-auth.dto.ts
export class SocialAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsUrl()
  redirectUri?: string;
}
```

### 3. Social Settings DTO

```typescript
// social-settings.dto.ts
export class SocialSettingsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SyncSettingsDto)
  syncSettings?: SyncSettingsDto;
}

export class PrivacySettingsDto {
  @IsOptional()
  @IsBoolean()
  showLinkedInProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  showGitHubRepos?: boolean;

  @IsOptional()
  @IsBoolean()
  showSocialConnections?: boolean;

  @IsOptional()
  @IsBoolean()
  allowProfileSync?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publicSocialLinks?: string[];
}

export class SyncSettingsDto {
  @IsOptional()
  @IsBoolean()
  autoSync?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['daily', 'weekly', 'monthly'])
  syncFrequency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  syncFields?: string[];
}
```

---

## 🔧 Services Implementation

### 1. Social Account Service

```typescript
// social-account.service.ts
@Injectable()
export class SocialAccountService {
  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountRepository: Repository<SocialAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private oauthService: OAuthService
  ) {}

  async getUserSocialAccounts(userId: string) {
    const socialAccounts = await this.socialAccountRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });

    return {
      success: true,
      data: { socialAccounts }
    };
  }

  async linkSocialAccount(userId: string, linkDto: LinkSocialAccountDto) {
    // Check if social account already exists
    const existingAccount = await this.socialAccountRepository.findOne({
      where: { uid: linkDto.uid, provider: linkDto.provider }
    });

    if (existingAccount) {
      throw new BadRequestException('This social account is already linked');
    }

    // Check if user already has account for this provider
    const userExistingAccount = await this.socialAccountRepository.findOne({
      where: { userId, provider: linkDto.provider }
    });

    const socialAccount = userExistingAccount || new SocialAccount();
    
    Object.assign(socialAccount, {
      ...linkDto,
      userId,
      status: 'active',
      lastSyncedAt: new Date()
    });

    const savedAccount = await this.socialAccountRepository.save(socialAccount);

    return {
      success: true,
      data: { socialAccount: savedAccount }
    };
  }

  async unlinkSocialAccount(userId: string, socialAccountId: string) {
    const socialAccount = await this.socialAccountRepository.findOne({
      where: { id: socialAccountId, userId }
    });

    if (!socialAccount) {
      throw new NotFoundException('Social account not found');
    }

    await this.socialAccountRepository.remove(socialAccount);

    return {
      success: true,
      message: 'Social account unlinked successfully'
    };
  }

  async syncSocialAccount(userId: string, socialAccountId: string) {
    const socialAccount = await this.socialAccountRepository.findOne({
      where: { id: socialAccountId, userId }
    });

    if (!socialAccount) {
      throw new NotFoundException('Social account not found');
    }

    // Refresh token if needed
    if (this.isTokenExpired(socialAccount)) {
      await this.refreshAccessToken(socialAccount);
    }

    // Fetch latest data from provider
    const latestData = await this.oauthService.fetchProfileData(
      socialAccount.provider,
      socialAccount.accessToken
    );

    const oldMetadata = socialAccount.metadata || {};
    const changes = this.detectChanges(oldMetadata, latestData);

    // Update social account
    socialAccount.metadata = latestData;
    socialAccount.lastSyncedAt = new Date();
    await this.socialAccountRepository.save(socialAccount);

    return {
      success: true,
      data: {
        syncedAt: socialAccount.lastSyncedAt,
        syncedData: latestData,
        changes
      }
    };
  }

  async syncAllSocialAccounts(userId: string) {
    const socialAccounts = await this.socialAccountRepository.find({
      where: { userId, status: 'active' }
    });

    const syncResults = await Promise.allSettled(
      socialAccounts.map(account => 
        this.syncSocialAccount(userId, account.id)
      )
    );

    const results = syncResults.map((result, index) => ({
      socialAccountId: socialAccounts[index].id,
      provider: socialAccounts[index].provider,
      status: result.status === 'fulfilled' ? 'success' : 'failed',
      syncedAt: result.status === 'fulfilled' ? new Date() : null,
      error: result.status === 'rejected' ? result.reason : null
    }));

    const summary = {
      totalAccounts: socialAccounts.length,
      successfulSyncs: results.filter(r => r.status === 'success').length,
      failedSyncs: results.filter(r => r.status === 'failed').length,
      totalChanges: 0 // Calculate from results
    };

    return {
      success: true,
      data: { syncResults: results, summary }
    };
  }

  private isTokenExpired(socialAccount: SocialAccount): boolean {
    if (!socialAccount.expiresAt) return false;
    return new Date() >= socialAccount.expiresAt;
  }

  private async refreshAccessToken(socialAccount: SocialAccount) {
    if (!socialAccount.refreshToken) {
      throw new BadRequestException('No refresh token available');
    }

    const newTokens = await this.oauthService.refreshToken(
      socialAccount.provider,
      socialAccount.refreshToken
    );

    socialAccount.accessToken = newTokens.accessToken;
    socialAccount.refreshToken = newTokens.refreshToken;
    socialAccount.expiresAt = newTokens.expiresAt;

    await this.socialAccountRepository.save(socialAccount);
  }

  private detectChanges(oldData: any, newData: any): any[] {
    const changes = [];
    
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes.push({
          field: key,
          oldValue: oldData[key],
          newValue: newData[key]
        });
      }
    }

    return changes;
  }
}
```

### 2. Social Authentication Service

```typescript
// social-auth.service.ts
@Injectable()
export class SocialAuthService {
  constructor(
    private socialAccountService: SocialAccountService,
    private userService: UserService,
    private jwtService: JwtService,
    private oauthService: OAuthService
  ) {}

  async authenticateWithSocial(provider: string, authDto: SocialAuthDto) {
    // Exchange code for access token
    const tokenData = await this.oauthService.exchangeCodeForToken(
      provider,
      authDto.code,
      authDto.redirectUri
    );

    // Fetch user profile from provider
    const profileData = await this.oauthService.fetchProfileData(
      provider,
      tokenData.accessToken
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
      expiresAt: tokenData.expiresAt,
      metadata: profileData
    });

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isNewUser
        },
        tokens,
        socialAccount: {
          provider,
          uid: profileData.id,
          status: 'active'
        }
      }
    };
  }

  private async findUserBySocialAccount(provider: string, uid: string): Promise<User | null> {
    const socialAccount = await this.socialAccountRepository.findOne({
      where: { provider, uid },
      relations: ['user']
    });

    return socialAccount?.user || null;
  }

  private async createUserFromSocialProfile(profile: any): Promise<User> {
    return this.userService.createUser({
      email: profile.email,
      firstName: profile.firstName || profile.name?.split(' ')[0],
      lastName: profile.lastName || profile.name?.split(' ')[1],
      profilePicture: profile.picture || profile.avatar
    });
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 3600
    };
  }
}
```

---

## 📋 Checklist

- [ ] Social Account Management (CRUD)
- [ ] Social Authentication (OAuth)
- [ ] Social Data Synchronization
- [ ] Social Profile Search
- [ ] Social Settings Management
- [ ] DTOs
- [ ] Services
- [ ] Controllers
- [ ] OAuth Integration
- [ ] Unit Tests
- [ ] Integration Tests

---

**🎉 Ready for implementation!**