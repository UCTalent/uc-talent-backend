import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import {
  EmploymentStatus,
  EnglishProficiency,
} from '../entities/talent.entity';

export class UpdateTalentDto {
  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @IsOptional()
  @IsEnum(EnglishProficiency)
  englishProficiency?: EnglishProficiency;

  @IsOptional()
  @IsNumber()
  experienceLevel?: number;

  @IsOptional()
  @IsNumber()
  managementLevel?: number;

  @IsOptional()
  @IsString()
  headline?: string;
}
