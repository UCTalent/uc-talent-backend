import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ description: 'Degree name' })
  @IsString()
  degree: string;

  @ApiProperty({ description: 'School/University name' })
  @IsString()
  school: string;

  @ApiProperty({ description: 'Field of study', required: false })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Grade/GPA', required: false })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
