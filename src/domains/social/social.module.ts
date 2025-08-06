import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccount } from './entities/social-account.entity';
import { ExternalLink } from './entities/external-link.entity';
import { SocialAccountService } from './services/social-account.service';
import { ExternalLinkService } from './services/external-link.service';
import { SocialAccountController } from './controllers/social-account.controller';
import { SocialAccountRepository } from './repositories/social-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount, ExternalLink])],
  providers: [
    SocialAccountService,
    ExternalLinkService,
    SocialAccountRepository,
  ],
  controllers: [SocialAccountController],
  exports: [SocialAccountService, ExternalLinkService],
})
export class SocialModule {} 