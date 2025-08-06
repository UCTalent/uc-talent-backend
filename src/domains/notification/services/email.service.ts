import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = 'Welcome to UC Talent!';
    const html = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining UC Talent. We're excited to have you on board!</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendJobApplicationEmail(to: string, jobTitle: string, companyName: string): Promise<void> {
    const subject = 'Job Application Received';
    const html = `
      <h1>Application Received</h1>
      <p>Your application for ${jobTitle} at ${companyName} has been received.</p>
      <p>We'll keep you updated on the status of your application.</p>
    `;

    await this.sendEmail(to, subject, html);
  }
} 