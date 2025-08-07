import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';

// Domain modules
import { UserModule } from '@user/user.module';
import { TalentModule } from '@talent/talent.module';
import { JobModule } from '@job/job.module';
import { OrganizationModule } from '@organization/organization.module';
import { LocationModule } from '@location/location.module';
import { SkillModule } from '@skill/skill.module';
import { PaymentModule } from '@payment/payment.module';
import { AdminModule } from '@admin/admin.module';
import { SocialModule } from '@social/social.module';
import { PartnerModule } from '@partner/partner.module';
import { NotificationModule } from '@notification/notification.module';
import { AuthModule } from '@auth/auth.module';

// Infrastructure modules
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AuthenticationModule } from '@infrastructure/authentication/authentication.module';
import { BackgroundJobsModule } from '@infrastructure/background-jobs/background-jobs.module';
import { EmailModule } from '@infrastructure/email/email.module';

// Shared cross-cutting modules
import { ValidationModule } from '@shared/cross-cutting/validation/validation.module';
import { AuthorizationModule } from '@shared/cross-cutting/authorization';
import { LoggingModule } from '@shared/cross-cutting/logging/logging.module';
import { CachingModule } from '@shared/cross-cutting/caching/caching.module';

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
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
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
    ValidationModule,
    AuthorizationModule,
    LoggingModule,
    CachingModule,
  ],
})
export class AppModule {}
