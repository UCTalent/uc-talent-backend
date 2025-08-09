import { Injectable } from '@nestjs/common';
import { MailerService } from '@infrastructure/email/services/mailer.service';
import { env } from '@/shared/infrastructure/env';

@Injectable()
export class UserMailer {
  constructor(private readonly emailService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = 'Welcome to UC Talent!';
    const html = `
      <h1>Welcome to UC Talent!</h1>
      <p>Dear ${name},</p>
      <p>Welcome to UC Talent! We're excited to have you join our platform.</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Add your skills and experience</li>
        <li>Browse available jobs</li>
        <li>Connect with companies</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const subject = 'Password Reset Request';
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }

  async sendEmailConfirmation(
    to: string,
    confirmationToken: string,
  ): Promise<void> {
    const subject = 'Confirm Your Email Address';
    const confirmUrl = `${env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
    const html = `
      <h1>Confirm Your Email Address</h1>
      <p>Please confirm your email address by clicking the link below:</p>
      <p><a href="${confirmUrl}">Confirm Email</a></p>
      <p>If you didn't create an account, please ignore this email.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }

  async sendProfileUpdateNotification(to: string, name: string): Promise<void> {
    const subject = 'Profile Updated Successfully';
    const html = `
      <h1>Profile Updated</h1>
      <p>Dear ${name},</p>
      <p>Your profile has been updated successfully.</p>
      <p>You can view your updated profile in your dashboard.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }
}
