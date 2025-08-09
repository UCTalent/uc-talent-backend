import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class JobClosureReasonDto {
  @ApiProperty({ required: false, description: 'Other reason for closure' })
  @IsOptional()
  @IsString()
  other_reason?: string;

  @ApiProperty({
    required: false,
    description: 'Choice options for closure',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choice_options?: string[];
}

export class CloseJobDto {
  @ApiProperty({ description: 'Type of job closure' })
  @IsString()
  close_type: string;

  @ApiProperty({
    required: false,
    description: 'Job closure reasons',
    type: [JobClosureReasonDto],
  })
  @IsOptional()
  @IsArray()
  job_closure_reasons_attributes?: JobClosureReasonDto[];
}
