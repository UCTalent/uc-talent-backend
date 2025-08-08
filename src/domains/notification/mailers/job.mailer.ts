import { Injectable } from '@nestjs/common';
import { MailerService } from '@infrastructure/email/services/mailer.service';

@Injectable()
export class JobMailer {
  constructor(private readonly emailService: MailerService) {}

  async sendJobApplicationConfirmation(
    to: string,
    jobTitle: string,
    companyName: string,
    candidateName: string,
  ): Promise<void> {
    const subject = 'Job Application Confirmation';
    const html = `
      <h1>Application Confirmation</h1>
      <p>Dear ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received.</p>
      <p>We will review your application and get back to you soon.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }

  async sendJobReferralNotification(
    to: string,
    jobTitle: string,
    companyName: string,
    referrerName: string,
  ): Promise<void> {
    const subject = 'Job Referral Notification';
    const html = `
      <h1>Job Referral</h1>
      <p>You have been referred for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> by ${referrerName}.</p>
      <p>Please review the job details and apply if interested.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }

  async sendJobStatusUpdate(
    to: string,
    jobTitle: string,
    companyName: string,
    status: string,
  ): Promise<void> {
    const subject = 'Job Application Status Update';
    const html = `
      <h1>Application Status Update</h1>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
      <p><strong>New Status:</strong> ${status}</p>
      <p>We'll keep you informed of any further updates.</p>
      <p>Best regards,<br>The UC Talent Team</p>
    `;

    await this.emailService.sendEmail(to, subject, html);
  }
}
