import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(
    email: string,
    name: string,
    confirmationToken: string,
  ): Promise<void> {
    const confirmationUrl = this.buildConfirmationUrl(confirmationToken);

    // Read email template
    const templatePath = path.join(
      __dirname,
      '../templates/confirmation-email.template.html',
    );
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{confirmationUrl}}/g, confirmationUrl);

    const subject = 'Confirm Your Email - UC Talent';

    await this.mailerService.sendEmail(email, subject, htmlTemplate);
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = this.buildPasswordResetUrl(resetToken);

    // Read email template
    const templatePath = path.join(
      __dirname,
      '../templates/password-reset.template.html',
    );
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, name)
      .replace(/{{resetUrl}}/g, resetUrl);

    const subject = 'Reset Your Password - UC Talent';

    await this.mailerService.sendEmail(email, subject, htmlTemplate);
  }

  private buildConfirmationUrl(token: string): string {
    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    return `${frontendUrl}/confirm-email?token=${token}`;
  }

  private buildPasswordResetUrl(token: string): string {
    const frontendUrl = this.configService.get(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    return `${frontendUrl}/reset-password?token=${token}`;
  }
}
