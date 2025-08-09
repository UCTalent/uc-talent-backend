import { ApiProperty } from '@nestjs/swagger';

import { JobStatus, LocationType } from '@job/entities/job.entity';

export class JobResponseDto {
  @ApiProperty({
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Job number',
    example: 1001,
  })
  jobNumber: number;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  title: string;

  @ApiProperty({
    description: 'Job description',
    example: 'We are looking for a senior software engineer...',
    required: false,
  })
  about?: string;

  @ApiProperty({
    description: 'Experience level',
    example: 5,
    required: false,
  })
  experienceLevel?: number;

  @ApiProperty({
    description: 'Management level',
    example: 2,
    required: false,
  })
  managementLevel?: number;

  @ApiProperty({
    description: 'Job type',
    example: 'Full-time',
    required: false,
  })
  jobType?: string;

  @ApiProperty({
    description: 'Job responsibilities',
    required: false,
  })
  responsibilities?: string;

  @ApiProperty({
    description: 'Minimum qualifications',
    required: false,
  })
  minimumQualifications?: string;

  @ApiProperty({
    description: 'Preferred requirements',
    required: false,
  })
  preferredRequirement?: string;

  @ApiProperty({
    description: 'Job benefits',
    required: false,
  })
  benefits?: string;

  @ApiProperty({
    description: 'Direct manager name',
    required: false,
  })
  directManager?: string;

  @ApiProperty({
    description: 'Direct manager title',
    required: false,
  })
  directManagerTitle?: string;

  @ApiProperty({
    description: 'Direct manager profile',
    required: false,
  })
  directManagerProfile?: string;

  @ApiProperty({
    description: 'Direct manager logo',
    required: false,
  })
  directManagerLogo?: string;

  @ApiProperty({
    description: 'Location type',
    enum: LocationType,
    example: LocationType.REMOTE,
  })
  locationType: LocationType;

  @ApiProperty({
    description: 'Location value',
    required: false,
  })
  locationValue?: string;

  @ApiProperty({
    description: 'Salary from in cents',
    example: 8000000,
    required: false,
  })
  salaryFromCents?: number;

  @ApiProperty({
    description: 'Salary from currency',
    example: 'USD',
    required: false,
  })
  salaryFromCurrency?: string;

  @ApiProperty({
    description: 'Salary to in cents',
    example: 12000000,
    required: false,
  })
  salaryToCents?: number;

  @ApiProperty({
    description: 'Salary to currency',
    example: 'USD',
    required: false,
  })
  salaryToCurrency?: string;

  @ApiProperty({
    description: 'Salary type',
    required: false,
  })
  salaryType?: string;

  @ApiProperty({
    description: 'Referral bonus in cents',
    example: 500000,
    required: false,
  })
  referralCents?: number;

  @ApiProperty({
    description: 'Referral currency',
    example: 'USD',
    required: false,
  })
  referralCurrency?: string;

  @ApiProperty({
    description: 'Referral type',
    required: false,
  })
  referralType?: string;

  @ApiProperty({
    description: 'Referral information',
    required: false,
  })
  referralInfo?: Record<string, any>;

  @ApiProperty({
    description: 'Apply method',
    required: false,
  })
  applyMethod?: string;

  @ApiProperty({
    description: 'Apply target',
    required: false,
  })
  applyTarget?: string;

  @ApiProperty({
    description: 'English level requirement',
    required: false,
  })
  englishLevel?: string;

  @ApiProperty({
    description: 'Job status',
    enum: JobStatus,
    example: JobStatus.PUBLISHED,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'Job priority',
    required: false,
  })
  priority?: string;

  @ApiProperty({
    description: 'Job source',
    required: false,
  })
  source?: string;

  @ApiProperty({
    description: 'Job network',
    required: false,
  })
  network?: string;

  @ApiProperty({
    description: 'Posted date',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  postedDate?: Date;

  @ApiProperty({
    description: 'Expired date',
    example: '2024-02-15T00:00:00.000Z',
    required: false,
  })
  expiredDate?: Date;

  @ApiProperty({
    description: 'Address token',
    required: false,
  })
  addressToken?: string;

  @ApiProperty({
    description: 'Chain ID',
    required: false,
  })
  chainId?: string;

  @ApiProperty({
    description: 'Created by user ID',
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Organization ID',
    required: false,
  })
  organizationId?: string;

  @ApiProperty({
    description: 'Speciality ID',
    required: false,
  })
  specialityId?: string;

  @ApiProperty({
    description: 'City ID',
    required: false,
  })
  cityId?: string;

  @ApiProperty({
    description: 'Country ID',
    required: false,
  })
  countryId?: string;

  @ApiProperty({
    description: 'Region ID',
    required: false,
  })
  regionId?: string;

  @ApiProperty({
    description: 'Global region ID',
    required: false,
  })
  globalRegionId?: string;

  @ApiProperty({
    description: 'Partner host ID',
    required: false,
  })
  partnerHostId?: string;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginationDto {
  @ApiProperty()
  current_page: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  total_count: number;

  @ApiProperty()
  per_page: number;
}

export class JobListResponseDto {
  @ApiProperty({ type: [JobResponseDto] })
  jobs: JobResponseDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
