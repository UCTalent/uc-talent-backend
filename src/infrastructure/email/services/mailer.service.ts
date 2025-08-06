import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class MailerService {
  private ses: AWS.SES;

  constructor(private configService: ConfigService) {
    this.ses = new AWS.SES({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const params = {
      Source: this.configService.get('AWS_SES_FROM_EMAIL'),
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      await this.ses.sendEmail(params).promise();
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendTemplatedEmail(to: string, templateName: string, templateData: any): Promise<void> {
    const params = {
      Source: this.configService.get('AWS_SES_FROM_EMAIL'),
      Destination: {
        ToAddresses: [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    };

    try {
      await this.ses.sendTemplatedEmail(params).promise();
    } catch (error) {
      throw new Error(`Failed to send templated email: ${error.message}`);
    }
  }
} 