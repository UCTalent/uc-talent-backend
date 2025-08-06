import { ApiProperty } from '@nestjs/swagger';

export class SkillResponseDto {
  @ApiProperty({ description: 'Skill ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Skill name', example: 'JavaScript' })
  name: string;

  @ApiProperty({ description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  roleId?: string;

  @ApiProperty({ description: 'Skill created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Skill updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Skill deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class SkillListResponseDto {
  @ApiProperty({ description: 'List of skills', type: [SkillResponseDto] })
  skills: SkillResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Frontend Developer' })
  name: string;

  @ApiProperty({ description: 'Role description', example: 'Frontend development role', required: false })
  description?: string;

  @ApiProperty({ description: 'Role created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Role updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Role deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class RoleListResponseDto {
  @ApiProperty({ description: 'List of roles', type: [RoleResponseDto] })
  roles: RoleResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
}

export class SpecialityResponseDto {
  @ApiProperty({ description: 'Speciality ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Speciality name', example: 'Web Development' })
  name: string;

  @ApiProperty({ description: 'Speciality description', example: 'Web development speciality', required: false })
  description?: string;

  @ApiProperty({ description: 'Speciality created at', example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Speciality updated at', example: '2024-01-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Speciality deleted at', example: '2024-01-15T00:00:00.000Z', required: false })
  deletedAt?: Date;
}

export class SpecialityListResponseDto {
  @ApiProperty({ description: 'List of specialities', type: [SpecialityResponseDto] })
  specialities: SpecialityResponseDto[];

  @ApiProperty({ description: 'Total count', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;
} 