import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

import { EmailService } from './services/email.service';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MailerService,
    EmailService,
    {
      provide: 'AWS_SES',
      useFactory: (configService: ConfigService) => {
        return new AWS.SES({
          accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          region: configService.get('AWS_REGION'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailerService, EmailService],
})
export class EmailModule {}
