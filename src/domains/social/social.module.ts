import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Note: HttpModule will be added when @nestjs/axios is installed
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Entities
import { SocialAccount } from './entities/social-account.entity';
import { SocialSetting } from './entities/social-setting.entity';
import { SocialSyncLog } from './entities/social-sync-log.entity';
import { ExternalLink } from './entities/external-link.entity';
import { User } from '@domains/user/entities/user.entity';

// Services
import { SocialAccountService } from './services/social-account.service';
import { SocialAuthService } from './services/social-auth.service';
import { OAuthService } from './services/oauth.service';
import { ExternalLinkService } from './services/external-link.service';

// Repositories
import { SocialAccountRepository } from './repositories/social-account.repository';
import { SocialSettingRepository } from './repositories/social-setting.repository';
import { SocialSyncLogRepository } from './repositories/social-sync-log.repository';

// Controllers
import { SocialAccountController, SocialAuthController } from './controllers/social-account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SocialAccount,
      SocialSetting,
      SocialSyncLog,
      ExternalLink,
      User,
    ]),
    // HttpModule, // Will be added when @nestjs/axios is installed
    JwtModule,
    ConfigModule,
  ],
  providers: [
    // Services
    SocialAccountService,
    SocialAuthService,
    OAuthService,
    ExternalLinkService,
    
    // Repositories
    SocialAccountRepository,
    SocialSettingRepository,
    SocialSyncLogRepository,
  ],
  controllers: [
    SocialAccountController,
    SocialAuthController,
  ],
  exports: [
    SocialAccountService,
    SocialAuthService,
    OAuthService,
    ExternalLinkService,
    SocialAccountRepository,
    SocialSettingRepository,
    SocialSyncLogRepository,
  ],
})
export class SocialModule {} 