import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job as BullJob } from 'bull';
import { JobMailer } from '@notification/mailers/job.mailer';

@Processor('job-apply')
export class JobApplyProcessor {
  private readonly logger = new Logger(JobApplyProcessor.name);

  constructor(private readonly jobMailer: JobMailer) {}

  @Process('send-application-confirmation')
  async handleSendApplicationConfirmation(job: BullJob) {
    this.logger.debug('Processing job application confirmation...');
    
    const { to, jobTitle, companyName, candidateName } = job.data;
    
    try {
      await this.jobMailer.sendJobApplicationConfirmation(
        to,
        jobTitle,
        companyName,
        candidateName,
      );
      
      this.logger.debug('Application confirmation email sent successfully');
    } catch (error) {
      this.logger.error('Failed to send application confirmation email', error);
      throw error;
    }
  }

  @Process('update-application-status')
  async handleUpdateApplicationStatus(job: BullJob) {
    this.logger.debug('Processing application status update...');
    
    const { applicationId, newStatus } = job.data;
    
    try {
      // Update application status logic here
      this.logger.debug(`Application ${applicationId} status updated to ${newStatus}`);
    } catch (error) {
      this.logger.error('Failed to update application status', error);
      throw error;
    }
  }
} 