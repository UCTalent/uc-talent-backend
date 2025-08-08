import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('web3-event')
export class Web3EventProcessor {
  private readonly logger = new Logger(Web3EventProcessor.name);

  @Process('process-payment-event')
  async handlePaymentEvent(job: Job) {
    this.logger.debug('Processing payment event...');

    const { eventData, transactionHash } = job.data;

    try {
      // Process payment event logic here
      this.logger.debug(`Processed payment event: ${transactionHash}`);
    } catch (error) {
      this.logger.error('Failed to process payment event', error);
      throw error;
    }
  }

  @Process('process-referral-event')
  async handleReferralEvent(job: Job) {
    this.logger.debug('Processing referral event...');

    const { eventData, transactionHash } = job.data;

    try {
      // Process referral event logic here
      this.logger.debug(`Processed referral event: ${transactionHash}`);
    } catch (error) {
      this.logger.error('Failed to process referral event', error);
      throw error;
    }
  }

  @Process('process-wallet-event')
  async handleWalletEvent(job: Job) {
    this.logger.debug('Processing wallet event...');

    const { eventData, transactionHash } = job.data;

    try {
      // Process wallet event logic here
      this.logger.debug(`Processed wallet event: ${transactionHash}`);
    } catch (error) {
      this.logger.error('Failed to process wallet event', error);
      throw error;
    }
  }
}
