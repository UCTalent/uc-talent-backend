import type { Document } from '@documents/interface';
import { ApplyJobDto } from '@domains/job/dtos/apply-job.dto';
import { CloseJobDto } from '@domains/job/dtos/close-job.dto';
import { CreateJobDto } from '@domains/job/dtos/create-job.dto';
import { JobIndexQueryDto } from '@domains/job/dtos/job-index-query.dto';
import {
  JobListResponseDto,
  JobResponseDto,
} from '@domains/job/dtos/job-response.dto';
import { ReferCandidateDto } from '@domains/job/dtos/refer-candidate.dto';
import { UpdateJobDto } from '@domains/job/dtos/update-job.dto';

const createJob: Document = {
  operation: { summary: 'Create a new job' },
  body: { type: CreateJobDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Job created successfully',
        type: JobResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request - validation error' }],
  },
} as const;

const getJobs: Document = {
  operation: { summary: 'Get jobs with filters' },
  query: { type: JobIndexQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Jobs retrieved successfully',
        type: JobListResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request - validation error' }],
  },
} as const;

const getJobById: Document = {
  operation: { summary: 'Get job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job found successfully',
        type: JobResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const updateJob: Document = {
  operation: { summary: 'Update job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  body: { type: UpdateJobDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job updated successfully',
        type: JobResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request - validation error' }],
  },
} as const;

const deleteJob: Document = {
  operation: { summary: 'Delete job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job deleted successfully',
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const softDeleteJob: Document = {
  operation: { summary: 'Soft delete job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job soft deleted successfully',
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const restoreJob: Document = {
  operation: { summary: 'Restore job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job restored successfully',
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const applyForJob: Document = {
  operation: { summary: 'Apply for job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  body: { type: ApplyJobDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job applied successfully',
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const closeJob: Document = {
  operation: { summary: 'Close job by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  body: { type: CloseJobDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job closed successfully',
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const generateReferralLink: Document = {
  operation: { summary: 'Generate referral link by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Referral link generated successfully',
        type: String,
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const referCandidate: Document = {
  operation: { summary: 'Refer a candidate for a job' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  body: { type: ReferCandidateDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Candidate referred successfully',
        type: String,
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

const getSimilarJobs: Document = {
  operation: { summary: 'Get similar jobs by ID' },
  param: {
    name: 'id',
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Similar jobs retrieved successfully',
        type: JobListResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Job not found' }],
  },
} as const;

export const Docs = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  softDeleteJob,
  restoreJob,
  applyForJob,
  closeJob,
  generateReferralLink,
  referCandidate,
  getSimilarJobs,
};
