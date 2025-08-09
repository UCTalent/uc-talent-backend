import type { Document } from '@documents/interface';
import {
  SpecialityListResponseDto,
  SpecialityResponseDto,
} from '@skill/dtos/skill-response.dto';

const getSpecialities: Document = {
  operation: { summary: 'Get all specialities' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Specialities retrieved successfully',
        type: SpecialityListResponseDto,
      },
    ],
  },
} as const;

const getSpecialityById: Document = {
  operation: { summary: 'Get speciality by ID' },
  param: {
    name: 'id',
    description: 'Speciality ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Speciality found successfully',
        type: SpecialityResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Speciality not found' }],
  },
} as const;

export const Docs = { getSpecialities, getSpecialityById };
