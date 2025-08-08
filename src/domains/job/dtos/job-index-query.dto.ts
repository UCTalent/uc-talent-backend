import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class SalaryRangeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  max?: number;
}

export class JobIndexQueryDto {
  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false, description: 'Location region' })
  @IsOptional()
  @IsString()
  location_region?: string;

  @ApiProperty({ required: false, description: 'Location country' })
  @IsOptional()
  @IsString()
  location_country?: string;

  @ApiProperty({ required: false, description: 'Location city' })
  @IsOptional()
  @IsString()
  location_city?: string;

  @ApiProperty({
    required: false,
    description: 'Location types',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location_types?: string[];

  @ApiProperty({ required: false, description: 'Date posted filter' })
  @IsOptional()
  @IsString()
  date_posted?: string;

  @ApiProperty({ required: false, description: 'Job types', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  job_types?: string[];

  @ApiProperty({ required: false, description: 'Salary range' })
  @IsOptional()
  @IsObject()
  @Type(() => SalaryRangeDto)
  salary_range?: SalaryRangeDto;

  @ApiProperty({ required: false, description: 'Domains', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domains?: string[];

  @ApiProperty({
    required: false,
    description: 'Experience levels',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(v => parseInt(v)))
  experience_levels?: number[];

  @ApiProperty({
    required: false,
    description: 'Management levels',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(v => parseInt(v)))
  management_levels?: number[];

  @ApiProperty({
    required: false,
    description: 'Specific job IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @ApiProperty({ required: false, description: 'Partner host' })
  @IsOptional()
  @IsString()
  partner_host?: string;
}
