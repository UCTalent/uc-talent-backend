import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  EmploymentStatus,
  EnglishProficiency,
  TalentStatus,
} from '../entities/talent.entity';

export class TalentIndexQueryDto {
  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({
    required: false,
    description: 'Employment status',
    enum: EmploymentStatus,
  })
  @IsOptional()
  @IsEnum(EmploymentStatus)
  employment_status?: EmploymentStatus;

  @ApiProperty({
    required: false,
    description: 'English proficiency',
    enum: EnglishProficiency,
  })
  @IsOptional()
  @IsEnum(EnglishProficiency)
  english_proficiency?: EnglishProficiency;

  @ApiProperty({
    required: false,
    description: 'Experience levels',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map((v) => parseInt(v)))
  experience_levels?: number[];

  @ApiProperty({
    required: false,
    description: 'Management levels',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map((v) => parseInt(v)))
  management_levels?: number[];

  @ApiProperty({
    required: false,
    description: 'Talent status',
    enum: TalentStatus,
  })
  @IsOptional()
  @IsEnum(TalentStatus)
  status?: TalentStatus;

  @ApiProperty({
    required: false,
    description: 'Speciality IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  speciality_ids?: string[];

  @ApiProperty({ required: false, description: 'Skill IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skill_ids?: string[];

  @ApiProperty({ required: false, description: 'Role IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  role_ids?: string[];

  @ApiProperty({ required: false, description: 'Location city ID' })
  @IsOptional()
  @IsString()
  location_city_id?: string;

  @ApiProperty({ required: false, description: 'Location country ID' })
  @IsOptional()
  @IsString()
  location_country_id?: string;

  @ApiProperty({
    required: false,
    description: 'Specific talent IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}
