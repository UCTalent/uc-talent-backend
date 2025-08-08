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

  async sendConfirmationEmail(email: string, name: string, confirmationToken: string): Promise<void> {
    const confirmationUrl = this.buildConfirmationUrl(confirmationToken);
    
    // Read email template
    const templatePath = path.join(__dirname, '../templates/confirmation-email.template.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Replace template variables
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{confirmationUrl}}/g, confirmationUrl);
    
    const subject = 'Confirm Your Email - UC Talent';
    
    await this.mailerService.sendEmail(email, subject, htmlTemplate);
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    const resetUrl = this.buildPasswordResetUrl(resetToken);
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reset Your Password - UC Talent</title>
        </head>
        <body>
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The UC Talent Team</p>
        </body>
      </html>
    `;
    
    const subject = 'Reset Your Password - UC Talent';
    
    await this.mailerService.sendEmail(email, subject, htmlTemplate);
  }

  private buildConfirmationUrl(token: string): string {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    return `${frontendUrl}/confirm-email?token=${token}`;
  }

  private buildPasswordResetUrl(token: string): string {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    return `${frontendUrl}/reset-password?token=${token}`;
  }
}
