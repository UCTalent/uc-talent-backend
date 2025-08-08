import { ApiProperty } from '@nestjs/swagger';
import {
  EmploymentStatus,
  EnglishProficiency,
  TalentStatus,
} from '@talent/entities/talent.entity';

export class TalentResponseDto {
  @ApiProperty({
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'About section',
    example: 'Experienced software developer...',
    required: false,
  })
  about?: string;

  @ApiProperty({
    description: 'Employment status',
    enum: EmploymentStatus,
    example: EmploymentStatus.AVAILABLE_NOW,
  })
  employmentStatus: EmploymentStatus;

  @ApiProperty({
    description: 'English proficiency level',
    enum: EnglishProficiency,
    example: EnglishProficiency.FLUENT,
  })
  englishProficiency: EnglishProficiency;

  @ApiProperty({ description: 'Experience level in years', example: 5 })
  experienceLevel: number;

  @ApiProperty({ description: 'Management level', example: 2 })
  managementLevel: number;

  @ApiProperty({
    description: 'Talent status',
    enum: TalentStatus,
    example: TalentStatus.ACTIVE,
  })
  status: TalentStatus;

  @ApiProperty({ description: 'Profile completion step', example: 3 })
  step: number;

  @ApiProperty({
    description: 'Professional headline',
    example: 'Senior Software Engineer',
    required: false,
  })
  headline?: string;

  @ApiProperty({
    description: 'Talent created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Talent updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Talent deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
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

export class TalentListResponseDto {
  @ApiProperty({ type: [TalentResponseDto] })
  talents: TalentResponseDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
