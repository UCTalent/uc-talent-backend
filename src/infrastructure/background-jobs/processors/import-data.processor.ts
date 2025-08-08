import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('import-data')
export class ImportDataProcessor {
  private readonly logger = new Logger(ImportDataProcessor.name);

  @Process('import-jobs')
  async handleImportJobs(job: Job) {
    this.logger.debug('Processing jobs import...');

    const { source, data } = job.data;

    try {
      // Import jobs logic here
      this.logger.debug(`Imported jobs from ${source}`);
    } catch (error) {
      this.logger.error('Failed to import jobs', error);
      throw error;
    }
  }

  @Process('import-organizations')
  async handleImportOrganizations(job: Job) {
    this.logger.debug('Processing organizations import...');

    const { source, data } = job.data;

    try {
      // Import organizations logic here
      this.logger.debug(`Imported organizations from ${source}`);
    } catch (error) {
      this.logger.error('Failed to import organizations', error);
      throw error;
    }
  }

  @Process('import-locations')
  async handleImportLocations(job: Job) {
    this.logger.debug('Processing locations import...');

    const { source, data } = job.data;

    try {
      // Import locations logic here
      this.logger.debug(`Imported locations from ${source}`);
    } catch (error) {
      this.logger.error('Failed to import locations', error);
      throw error;
    }
  }
}
