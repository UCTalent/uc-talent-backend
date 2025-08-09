import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JobService } from '@job/services/job.service';
import { CreateJobDto } from '@job/dtos/create-job.dto';
import { UpdateJobDto } from '@job/dtos/update-job.dto';
import { ApplyJobDto } from '@job/dtos/apply-job.dto';
import { ReferCandidateDto } from '@job/dtos/refer-candidate.dto';
import { CloseJobDto } from '@job/dtos/close-job.dto';
import { JobIndexQueryDto } from '@job/dtos/job-index-query.dto';
import { JobResponseDto } from '@job/dtos/job-response.dto';
import { Job } from '@job/entities/job.entity';
import { ResponseHandler } from '@shared/utils/response-handler';
import { Docs } from '@documents/job/job.document';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(Docs.createJob.operation)
  @ApiBody(Docs.createJob.body)
  @ApiResponse(Docs.createJob.responses.success[0])
  @ApiResponse(Docs.createJob.responses.error[0])
  async create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const job = await this.jobService.create(createJobDto, req.user?.id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(job),
      statusCode: HttpStatus.CREATED,
      message: 'Job created successfully',
    });
  }

  @Get()
  @ApiOperation(Docs.getJobs.operation)
  @ApiQuery(Docs.getJobs.query)
  @ApiResponse(Docs.getJobs.responses.success[0])
  async findAll(@Query() query: JobIndexQueryDto) {
    const result = await this.jobService.getJobs(query);
    return ResponseHandler.success({
      data: {
        jobs: result.jobs.map(job => this.mapToResponseDto(job)),
        pagination: result.pagination,
      },
      message: 'Jobs retrieved successfully',
    });
  }

  @Get(':id')
  @ApiOperation(Docs.getJobById.operation)
  @ApiParam(Docs.getJobById.param)
  @ApiResponse(Docs.getJobById.responses.success[0])
  @ApiResponse(Docs.getJobById.responses.error[0])
  async findById(@Param('id') id: string, @Request() req: any) {
    const result = await this.jobService.getJob(id, req.user?.id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.job),
      message: 'Job found successfully',
    });
  }

  @Put(':id')
  @ApiOperation(Docs.updateJob.operation)
  @ApiParam(Docs.updateJob.param)
  @ApiBody(Docs.updateJob.body)
  @ApiResponse(Docs.updateJob.responses.success[0])
  @ApiResponse(Docs.updateJob.responses.error[0])
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    const job = await this.jobService.update(id, updateJobDto, req.user?.id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(job),
      message: 'Job updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation(Docs.deleteJob.operation)
  @ApiParam(Docs.deleteJob.param)
  @ApiResponse(Docs.deleteJob.responses.success[0])
  @ApiResponse(Docs.deleteJob.responses.error[0])
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.jobService.delete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Job deleted successfully',
    });
  }

  @Patch(':id/soft-delete')
  @ApiOperation(Docs.softDeleteJob.operation)
  @ApiParam(Docs.softDeleteJob.param)
  @ApiResponse(Docs.softDeleteJob.responses.success[0])
  @ApiResponse(Docs.softDeleteJob.responses.error[0])
  async softDelete(@Param('id') id: string, @Request() req: any) {
    await this.jobService.softDelete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Job soft deleted successfully',
    });
  }

  @Patch(':id/restore')
  @ApiOperation(Docs.restoreJob.operation)
  @ApiParam(Docs.restoreJob.param)
  @ApiResponse(Docs.restoreJob.responses.success[0])
  @ApiResponse(Docs.restoreJob.responses.error[0])
  async restore(@Param('id') id: string) {
    await this.jobService.restore(id);
    return ResponseHandler.success({
      data: null,
      message: 'Job restored successfully',
    });
  }

  @Post(':id/apply')
  @ApiOperation(Docs.applyForJob.operation)
  @ApiParam(Docs.applyForJob.param)
  @ApiBody({ type: ApplyJobDto })
  @ApiResponse(Docs.applyForJob.responses.success[0])
  @ApiResponse(Docs.applyForJob.responses.error[0])
  async applyForJob(
    @Param('id') id: string,
    @Body() applyJobDto: ApplyJobDto,
    @Request() req: any,
  ) {
    const result = await this.jobService.applyForJob(
      id,
      applyJobDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: result,
      statusCode: HttpStatus.CREATED,
      message: 'Job application submitted successfully',
    });
  }

  @Post(':id/close')
  @ApiOperation(Docs.closeJob.operation)
  @ApiParam(Docs.closeJob.param)
  @ApiBody(Docs.closeJob.body)
  @ApiResponse(Docs.closeJob.responses.success[0])
  @ApiResponse(Docs.closeJob.responses.error[0])
  async closeJob(
    @Param('id') id: string,
    @Body() closeJobDto: CloseJobDto,
    @Request() req: any,
  ) {
    const result = await this.jobService.closeJob(
      id,
      closeJobDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: result,
      message: 'Job closed successfully',
    });
  }

  @Post(':id/generate-referral-link')
  @ApiOperation(Docs.generateReferralLink.operation)
  @ApiParam(Docs.generateReferralLink.param)
  @ApiResponse(Docs.generateReferralLink.responses.success[0])
  @ApiResponse(Docs.generateReferralLink.responses.error[0])
  async generateReferralLink(@Param('id') id: string, @Request() req: any) {
    const result = await this.jobService.generateReferralLink(id, req.user?.id);
    return ResponseHandler.success({
      data: result,
      message: 'Referral link generated successfully',
    });
  }

  @Post(':id/referral_candidate')
  @ApiOperation(Docs.referCandidate.operation)
  @ApiParam(Docs.referCandidate.param)
  @ApiBody(Docs.referCandidate.body)
  @ApiResponse(Docs.referCandidate.responses.success[0])
  @ApiResponse(Docs.referCandidate.responses.error[0])
  async referCandidate(
    @Param('id') id: string,
    @Body() referCandidateDto: ReferCandidateDto,
    @Request() req: any,
  ) {
    const result = await this.jobService.referCandidate(
      id,
      referCandidateDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: result,
      message: 'Candidate referred successfully',
    });
  }

  @Get(':id/similar_jobs')
  @ApiOperation(Docs.getSimilarJobs.operation)
  @ApiParam(Docs.getSimilarJobs.param)
  @ApiResponse(Docs.getSimilarJobs.responses.success[0])
  @ApiResponse(Docs.getSimilarJobs.responses.error[0])
  async getSimilarJobs(@Param('id') id: string) {
    const jobs = await this.jobService.getSimilarJobs(id);
    return ResponseHandler.success({
      data: {
        jobs: jobs.map(job => this.mapToResponseDto(job)),
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: jobs.length,
          per_page: jobs.length,
        },
      },
      message: 'Similar jobs retrieved successfully',
    });
  }

  private mapToResponseDto(job: Job): JobResponseDto {
    return {
      id: job.id,
      jobNumber: job.jobNumber,
      title: job.title,
      about: job.about,
      experienceLevel: job.experienceLevel,
      managementLevel: job.managementLevel,
      jobType: job.jobType,
      responsibilities: job.responsibilities,
      minimumQualifications: job.minimumQualifications,
      preferredRequirement: job.preferredRequirement,
      benefits: job.benefits,
      directManager: job.directManager,
      directManagerTitle: job.directManagerTitle,
      directManagerProfile: job.directManagerProfile,
      directManagerLogo: job.directManagerLogo,
      locationType: job.locationType,
      locationValue: job.locationValue,
      salaryFromCents: job.salaryFromCents,
      salaryFromCurrency: job.salaryFromCurrency,
      salaryToCents: job.salaryToCents,
      salaryToCurrency: job.salaryToCurrency,
      salaryType: job.salaryType,
      referralCents: job.referralCents,
      referralCurrency: job.referralCurrency,
      referralType: job.referralType,
      referralInfo: job.referralInfo,
      applyMethod: job.applyMethod,
      applyTarget: job.applyTarget,
      englishLevel: job.englishLevel,
      status: job.status,
      priority: job.priority,
      source: job.source,
      network: job.network,
      postedDate: job.postedDate,
      expiredDate: job.expiredDate,
      addressToken: job.addressToken,
      chainId: job.chainId,
      createdBy: job.createdBy,
      organizationId: job.organizationId,
      specialityId: job.specialityId,
      cityId: job.cityId,
      countryId: job.countryId,
      regionId: job.regionId,
      globalRegionId: job.globalRegionId,
      partnerHostId: job.partnerHostId,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
