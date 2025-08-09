// import { TypeOrmModule } from '@nestjs/typeorm';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { HttpExceptionModule } from '@/shared/cross-cutting/exception/exception.module';
import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@auth/auth.module';
import { AuthenticationModule } from '@infrastructure/authentication/authentication.module';
import { BackgroundJobsModule } from '@infrastructure/background-jobs/background-jobs.module';
// Infrastructure modules
import { DatabaseModule } from '@infrastructure/database/database.module';
import { EmailModule } from '@infrastructure/email/email.module';
import { JobModule } from '@job/job.module';
import { LocationModule } from '@location/location.module';
import { NotificationModule } from '@notification/notification.module';
import { OrganizationModule } from '@organization/organization.module';
import { PartnerModule } from '@partner/partner.module';
import { PaymentModule } from '@payment/payment.module';
import { AuthorizationModule } from '@shared/cross-cutting/authorization';
import { CachingModule } from '@shared/cross-cutting/caching/caching.module';
import { LoggingModule } from '@shared/cross-cutting/logging/logging.module';
import { TransformerModule } from '@shared/cross-cutting/transformer/transformer.module';
import { ValidationModule } from '@shared/cross-cutting/validation/validation.module';
// Shared cross-cutting modules
import { EnvModule } from '@shared/infrastructure/env/env.module';
import { SkillModule } from '@skill/skill.module';
import { SocialModule } from '@social/social.module';
import { TalentModule } from '@talent/talent.module';
// Domain modules
import { UserModule } from '@user/user.module';

import { env } from './shared/infrastructure/env';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // GraphQL (temporarily disabled)
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   playground: true,
    //   introspection: true,
    // }),

    // Background Jobs
    BullModule.forRoot({
      redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Domain modules
    UserModule,
    TalentModule,
    JobModule,
    OrganizationModule,
    LocationModule,
    SkillModule,
    PaymentModule,
    AdminModule,
    SocialModule,
    PartnerModule,
    NotificationModule,
    AuthModule,

    // Infrastructure modules
    AuthenticationModule,
    BackgroundJobsModule,
    EmailModule,

    // Shared cross-cutting modules
    EnvModule,
    ValidationModule,
    AuthorizationModule,
    LoggingModule,
    CachingModule,
    HttpExceptionModule,
    TransformerModule,
  ],
})
export class AppModule {}
