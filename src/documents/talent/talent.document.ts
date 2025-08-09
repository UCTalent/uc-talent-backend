import { Document } from '@documents/interface';
import { CreateTalentDto } from '@talent/dtos/create-talent.dto';
import { UpdateTalentDto } from '@talent/dtos/update-talent.dto';
import { TalentIndexQueryDto } from '@talent/dtos/talent-index-query.dto';
import { CreateExperienceDto } from '@talent/dtos/create-experience.dto';
import { CreateEducationDto } from '@talent/dtos/create-education.dto';
import { CreateExternalLinkDto } from '@talent/dtos/create-external-link.dto';
import {
  TalentResponseDto,
  TalentListResponseDto,
} from '@talent/dtos/talent-response.dto';

const createTalent: Document = {
  operation: { summary: 'Create a new talent' },
  body: { type: CreateTalentDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Talent created successfully',
        type: TalentResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request - validation error' }],
  },
} as const;

const getTalents: Document = {
  operation: { summary: 'Get talents with filters' },
  query: { type: TalentIndexQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Talents retrieved successfully',
        type: TalentListResponseDto,
      },
    ],
  },
} as const;

const getTalentById: Document = {
  operation: { summary: 'Get talent by ID' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Talent found successfully',
        type: TalentResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Talent not found' }],
  },
} as const;

const updateTalent: Document = {
  operation: { summary: 'Update talent by ID' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: UpdateTalentDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Talent updated successfully',
        type: TalentResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Talent not found' }],
  },
} as const;

const deleteTalent: Document = {
  operation: { summary: 'Delete talent by ID' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [{ status: 200, description: 'Talent deleted successfully' }],
    error: [{ status: 404, description: 'Talent not found' }],
  },
} as const;

const getMyProfile: Document = {
  operation: { summary: 'Get current user talent profile' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Talent profile retrieved successfully',
        type: TalentResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Talent profile not found' }],
  },
} as const;

const getProfileCompletion: Document = {
  operation: { summary: 'Get talent profile completion percentage' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      { status: 200, description: 'Profile completion retrieved successfully' },
    ],
  },
} as const;

const addExperience: Document = {
  operation: { summary: 'Add experience to talent' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: CreateExperienceDto },
  responses: {
    success: [{ status: 201, description: 'Experience added successfully' }],
  },
} as const;

const addEducation: Document = {
  operation: { summary: 'Add education to talent' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: CreateEducationDto },
  responses: {
    success: [{ status: 201, description: 'Education added successfully' }],
  },
} as const;

const addExternalLink: Document = {
  operation: { summary: 'Add external link to talent' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: CreateExternalLinkDto },
  responses: {
    success: [{ status: 201, description: 'External link added successfully' }],
  },
} as const;

const getSimilarTalents: Document = {
  operation: { summary: 'Get similar talents' },
  param: {
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      { status: 200, description: 'Similar talents retrieved successfully' },
    ],
  },
} as const;

export const Docs = {
  createTalent,
  getTalents,
  getTalentById,
  updateTalent,
  deleteTalent,
  getMyProfile,
  getProfileCompletion,
  addExperience,
  addEducation,
  addExternalLink,
  getSimilarTalents,
};
