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
import { JobResponseDto, JobListResponseDto } from '@job/dtos/job-response.dto';
import { Job } from '@job/entities/job.entity';
import { ResponseHandler } from '@shared/utils/response-handler';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  async create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const job = await this.jobService.create(createJobDto, req.user?.id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(job),
      statusCode: HttpStatus.CREATED,
      message: 'Job created successfully',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get jobs with filters' })
  @ApiQuery({ type: JobIndexQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Jobs retrieved successfully',
    type: JobListResponseDto,
  })
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
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Job found successfully',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async findById(@Param('id') id: string, @Request() req: any) {
    const result = await this.jobService.getJob(id, req.user?.id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.job),
      message: 'Job found successfully',
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job by ID' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({
    status: 200,
    description: 'Job updated successfully',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
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
  @ApiOperation({ summary: 'Delete job by ID' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Job deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.jobService.delete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Job deleted successfully',
    });
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete job by ID' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Job soft deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async softDelete(@Param('id') id: string, @Request() req: any) {
    await this.jobService.softDelete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Job soft deleted successfully',
    });
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted job by ID' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Job restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async restore(@Param('id') id: string) {
    await this.jobService.restore(id);
    return ResponseHandler.success({
      data: null,
      message: 'Job restored successfully',
    });
  }

  @Post(':id/apply')
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: ApplyJobDto })
  @ApiResponse({
    status: 201,
    description: 'Job application submitted successfully',
  })
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
  @ApiOperation({ summary: 'Close a job' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CloseJobDto })
  @ApiResponse({
    status: 200,
    description: 'Job closed successfully',
  })
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
  @ApiOperation({ summary: 'Generate referral link for a job' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Referral link generated successfully',
  })
  async generateReferralLink(@Param('id') id: string, @Request() req: any) {
    const result = await this.jobService.generateReferralLink(id, req.user?.id);
    return ResponseHandler.success({
      data: result,
      message: 'Referral link generated successfully',
    });
  }

  @Post(':id/referral_candidate')
  @ApiOperation({ summary: 'Refer a candidate for a job' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: ReferCandidateDto })
  @ApiResponse({
    status: 200,
    description: 'Candidate referred successfully',
  })
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
  @ApiOperation({ summary: 'Get similar jobs' })
  @ApiParam({
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Similar jobs retrieved successfully',
  })
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
