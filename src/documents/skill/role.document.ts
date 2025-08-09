import { Document } from '@documents/interface';
import {
  RoleListResponseDto,
  RoleResponseDto,
} from '@skill/dtos/skill-response.dto';

const getRoles: Document = {
  operation: { summary: 'Get all roles' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Roles retrieved successfully',
        type: RoleListResponseDto,
      },
    ],
  },
} as const;

const getRoleById: Document = {
  operation: { summary: 'Get role by ID' },
  param: {
    name: 'id',
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Role found successfully',
        type: RoleResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Role not found' }],
  },
} as const;

export const Docs = { getRoles, getRoleById };
