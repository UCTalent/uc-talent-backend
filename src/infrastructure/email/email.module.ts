import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MailerService,
    {
      provide: 'AWS_SES',
      useFactory: (configService: ConfigService) => {
        const AWS = require('aws-sdk');
        return new AWS.SES({
          accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          region: configService.get('AWS_REGION'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailerService],
})
export class EmailModule {} 