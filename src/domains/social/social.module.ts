import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Note: HttpModule will be added when @nestjs/axios is installed
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@domains/user/entities/user.entity';
import { UserModule } from '@domains/user/user.module';

// Controllers
import {
  SocialAccountController,
  SocialAuthController,
} from './controllers/social-account.controller';
import { ExternalLink } from './entities/external-link.entity';
// Entities
import { SocialAccount } from './entities/social-account.entity';
import { SocialSetting } from './entities/social-setting.entity';
import { SocialSyncLog } from './entities/social-sync-log.entity';
import { ExternalLinkRepository } from './repositories/external-link.repository';
// Repositories
import { SocialAccountRepository } from './repositories/social-account.repository';
import { SocialSettingRepository } from './repositories/social-setting.repository';
import { SocialSyncLogRepository } from './repositories/social-sync-log.repository';
import { ExternalLinkService } from './services/external-link.service';
import { OAuthService } from './services/oauth.service';
// Services
import { SocialAccountService } from './services/social-account.service';
import { SocialAuthService } from './services/social-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SocialAccount,
      SocialSetting,
      SocialSyncLog,
      ExternalLink,
      User,
    ]),
    UserModule,
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
    ExternalLinkRepository,
  ],
  controllers: [SocialAccountController, SocialAuthController],
  exports: [
    SocialAccountService,
    SocialAuthService,
    OAuthService,
    ExternalLinkService,
    SocialAccountRepository,
    SocialSettingRepository,
    SocialSyncLogRepository,
    ExternalLinkRepository,
  ],
})
export class SocialModule {}
