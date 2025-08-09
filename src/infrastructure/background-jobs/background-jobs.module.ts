import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NotificationModule } from '@notification/notification.module';

import { ImportDataProcessor } from './processors/import-data.processor';
import { JobApplyProcessor } from './processors/job-apply.processor';
import { JobRecommendationProcessor } from './processors/job-recommendation.processor';
import { Web3EventProcessor } from './processors/web3-event.processor';

@Module({
  imports: [
    NotificationModule, // Import để có JobMailer
    BullModule.registerQueueAsync(
      {
        name: 'job-apply',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'job-recommendation',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'import-data',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'web3-event',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      }
    ),
  ],
  providers: [
    JobApplyProcessor,
    JobRecommendationProcessor,
    ImportDataProcessor,
    Web3EventProcessor,
  ],
  exports: [BullModule],
})
export class BackgroundJobsModule {}
