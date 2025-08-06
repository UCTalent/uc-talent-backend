import { IsOptional, IsString, IsEnum, IsNumber, IsDate } from 'class-validator';
import { JobStatus, LocationType } from '@job/entities/job.entity';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsNumber()
  experienceLevel?: number;

  @IsOptional()
  @IsNumber()
  managementLevel?: number;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  minimumQualifications?: string;

  @IsOptional()
  @IsString()
  preferredRequirement?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  directManager?: string;

  @IsOptional()
  @IsString()
  directManagerTitle?: string;

  @IsOptional()
  @IsString()
  directManagerProfile?: string;

  @IsOptional()
  @IsString()
  directManagerLogo?: string;

  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @IsOptional()
  @IsString()
  locationValue?: string;

  @IsOptional()
  @IsNumber()
  salaryFromCents?: number;

  @IsOptional()
  @IsString()
  salaryFromCurrency?: string;

  @IsOptional()
  @IsNumber()
  salaryToCents?: number;

  @IsOptional()
  @IsString()
  salaryToCurrency?: string;

  @IsOptional()
  @IsString()
  salaryType?: string;

  @IsOptional()
  @IsNumber()
  referralCents?: number;

  @IsOptional()
  @IsString()
  referralCurrency?: string;

  @IsOptional()
  @IsString()
  referralType?: string;

  @IsOptional()
  referralInfo?: Record<string, any>;

  @IsOptional()
  @IsString()
  applyMethod?: string;

  @IsOptional()
  @IsString()
  applyTarget?: string;

  @IsOptional()
  @IsString()
  englishLevel?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsDate()
  postedDate?: Date;

  @IsOptional()
  @IsDate()
  expiredDate?: Date;

  @IsOptional()
  @IsString()
  addressToken?: string;

  @IsOptional()
  @IsString()
  chainId?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  specialityId?: string;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsString()
  globalRegionId?: string;

  @IsOptional()
  @IsString()
  partnerHostId?: string;
} 