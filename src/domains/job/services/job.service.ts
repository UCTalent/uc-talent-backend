import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Job, JobStatus } from '@job/entities/job.entity';
import { CreateJobDto } from '@job/dtos/create-job.dto';
import { UpdateJobDto } from '@job/dtos/update-job.dto';
import { ApplyJobDto } from '@job/dtos/apply-job.dto';
import { ReferCandidateDto } from '@job/dtos/refer-candidate.dto';
import { CloseJobDto } from '@job/dtos/close-job.dto';
import { JobIndexQueryDto } from '@job/dtos/job-index-query.dto';
import { JobRepository } from '@job/repositories/job.repository';
import { JobApplyRepository } from '@job/repositories/job-apply.repository';
import { JobReferralRepository } from '@job/repositories/job-referral.repository';
import { ReferralLinkRepository } from '@job/repositories/referral-link.repository';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobApplyRepository: JobApplyRepository,
    private readonly jobReferralRepository: JobReferralRepository,
    private readonly referralLinkRepository: ReferralLinkRepository,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string): Promise<Job> {
    // Generate job number
    const jobNumber = await this.jobRepository.generateJobNumber();
    
    const job = await this.jobRepository.create({
      ...createJobDto,
      jobNumber,
      createdBy: userId,
      updatedBy: userId,
      status: JobStatus.PENDING_TO_REVIEW,
      postedDate: new Date(),
      expiredDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    });

    return job;
  }

  async findAll(): Promise<Job[]> {
    return this.jobRepository.findAll();
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, userId: string): Promise<Job> {
    const job = await this.findById(id);
    
    // Check if user can update this job
    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Only job creator can update job');
    }

    return this.jobRepository.update(id, { ...updateJobDto, updatedBy: userId });
  }

  async delete(id: string, userId: string): Promise<void> {
    const job = await this.findById(id);
    
    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Only job creator can delete job');
    }

    await this.jobRepository.delete(id);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const job = await this.findById(id);
    
    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Only job creator can delete job');
    }

    await this.jobRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.jobRepository.restore(id);
  }

  async getJobs(query: JobIndexQueryDto): Promise<{ jobs: Job[], pagination: any }> {
    const { page = 1, ...filters } = query;
    const perPage = 10;
    
    const [jobs, total] = await this.jobRepository.findWithFilters(filters);
    
    return {
      jobs,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / perPage),
        total_count: total,
        per_page: perPage
      }
    };
  }

  async getJob(id: string, userId?: string): Promise<{ job: Job, job_apply?: any }> {
    const job = await this.jobRepository.findById(id);
    
    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Job not found');
    }

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    let jobApply = null;
    if (userId) {
      // TODO: Get talent by userId and find job apply
      // const talent = await this.talentService.findByUserId(userId);
      // if (talent) {
      //   jobApply = await this.jobApplyRepository.findByJobAndTalent(id, talent.id);
      // }
    }

    return {
      job,
      job_apply: jobApply
    };
  }

  async applyForJob(jobId: string, applyJobDto: ApplyJobDto, userId: string): Promise<any> {
    // 1. Validate job
    const job = await this.jobRepository.findById(jobId);

    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Job not found or not published');
    }

    // 2. Get or create talent profile
    // TODO: Implement talent service
    // let talent = await this.talentService.findByUserId(userId);
    // if (!talent) {
    //   talent = await this.talentService.create({
    //     userId: userId,
    //     status: 'new_profile'
    //   });
    // }

    // 3. Check if already applied
    // const existingApply = await this.jobApplyRepository.findByJobAndTalent(jobId, talent.id);
    // if (existingApply) {
    //   throw new ConflictException('Already applied for this job');
    // }

    // 4. Create job application
    // const jobApply = await this.jobApplyRepository.create({
    //   jobId,
    //   talentId: talent.id,
    //   status: 'new',
    //   email: applyJobDto.email,
    //   phoneNumber: applyJobDto.phone_number,
    //   headline: applyJobDto.headline
    // });

    // await this.jobApplyRepository.save(jobApply);

    return {
      message: 'Job application submitted successfully',
      // job_apply: {
      //   id: jobApply.id,
      //   status: jobApply.status,
      //   created_at: jobApply.createdAt
      // }
    };
  }

  async closeJob(id: string, closeJobDto: CloseJobDto, userId: string): Promise<{ message: string }> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Only job creator can close job');
    }

    if (Job.FINISHED_STATUS.includes(job.status)) {
      throw new BadRequestException('Job has been closed or completed');
    }

    // Update job status
    await this.jobRepository.update(id, { 
      status: closeJobDto.close_type as JobStatus,
      updatedBy: userId 
    });

    return { message: 'Job closed successfully' };
  }

  async generateReferralLink(jobId: string, userId: string): Promise<{ link_token: string }> {
    // 1. Find job
    const job = await this.jobRepository.findById(jobId);

    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Job not found');
    }

    // 2. Find or create referral link
    let referralLink = await this.referralLinkRepository.findByJobAndReferrer(jobId, userId);

    if (!referralLink) {
      referralLink = await this.referralLinkRepository.create({
        jobId,
        referrerId: userId
      });
    }

    return { link_token: referralLink.id };
  }

  async referCandidate(jobId: string, referCandidateDto: ReferCandidateDto, userId: string): Promise<any> {
    // 1. Validate job
    const job = await this.jobRepository.findById(jobId);

    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Job not found');
    }

    // 2. Create job referral
    const jobReferral = await this.jobReferralRepository.create({
      jobId,
      referrerId: userId,
      candidateName: referCandidateDto.candidate_name,
      candidateEmail: referCandidateDto.candidate_email,
      candidatePhonenumber: referCandidateDto.candidate_phonenumber,
      candidateIntroduction: referCandidateDto.candidate_introduction,
      recommendation: referCandidateDto.recommendation,
      signature: referCandidateDto.web3_signature,
      personalSign: referCandidateDto.web3_chain_name
    });

    return {
      id: jobReferral.id,
      candidate_name: jobReferral.candidateName,
      candidate_email: jobReferral.candidateEmail,
      status: jobReferral.status,
      created_at: jobReferral.createdAt
    };
  }

  async getSimilarJobs(jobId: string, limit: number = 10): Promise<Job[]> {
    return this.jobRepository.findSimilarJobs(jobId, limit);
  }
} 