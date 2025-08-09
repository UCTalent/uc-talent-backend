import type { Document } from '@documents/interface';
import {
  SkillListResponseDto,
  SkillResponseDto,
} from '@skill/dtos/skill-response.dto';

const getSkills: Document = {
  operation: { summary: 'Get all skills' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Skills retrieved successfully',
        type: SkillListResponseDto,
      },
    ],
  },
} as const;

const getSkillById: Document = {
  operation: { summary: 'Get skill by ID' },
  param: {
    name: 'id',
    description: 'Skill ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Skill found successfully',
        type: SkillResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Skill not found' }],
  },
} as const;

const getSkillsByRole: Document = {
  operation: { summary: 'Get skills by role ID' },
  param: {
    name: 'roleId',
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Skills found successfully',
        type: SkillListResponseDto,
      },
    ],
  },
} as const;

export const Docs = {
  getSkills,
  getSkillById,
  getSkillsByRole,
};
