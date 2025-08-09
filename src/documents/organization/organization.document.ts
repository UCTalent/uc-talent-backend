import { Document } from '@documents/interface';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationQueryDto } from '@organization/dtos/organization-query.dto';
import {
  OrganizationResponseDto,
  OrganizationListResponseDto,
} from '@organization/dtos/organization-response.dto';

const createOrganization: Document = {
  operation: { summary: 'Create a new organization' },
  body: { type: CreateOrganizationDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Organization created successfully',
        type: OrganizationResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request - validation error' }],
  },
} as const;

const getOrganizations: Document = {
  operation: { summary: 'Get organizations list' },
  query: { type: OrganizationQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Organizations retrieved successfully',
        type: OrganizationListResponseDto,
      },
    ],
  },
} as const;

const searchOrganizations: Document = {
  operation: { summary: 'Search organizations' },
  query: { type: Object },
  responses: {
    success: [
      {
        status: 200,
        description: 'Organizations search completed successfully',
      },
    ],
  },
} as const;

const getOrganizationById: Document = {
  operation: { summary: 'Get organization by ID' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Organization found successfully',
        type: OrganizationResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Organization not found' }],
  },
} as const;

const updateOrganization: Document = {
  operation: { summary: 'Update organization by ID' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: UpdateOrganizationDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Organization updated successfully',
        type: OrganizationResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Organization not found' }],
  },
} as const;

const deleteOrganization: Document = {
  operation: { summary: 'Delete organization by ID' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      { status: 200, description: 'Organization deleted successfully' },
    ],
    error: [{ status: 404, description: 'Organization not found' }],
  },
} as const;

const uploadLogo: Document = {
  operation: { summary: 'Upload organization logo' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: {
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' },
      },
    },
  } as any,
  responses: {
    success: [{ status: 200, description: 'Logo uploaded successfully' }],
  },
} as const;

const deleteLogo: Document = {
  operation: { summary: 'Delete organization logo' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [{ status: 200, description: 'Logo deleted successfully' }],
  },
} as const;

const getStats: Document = {
  operation: { summary: 'Get organization statistics' },
  param: {
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Organization statistics retrieved successfully',
      },
    ],
  },
} as const;

const getAllSimpleList: Document = {
  operation: { summary: 'Get all organizations (simple list)' },
  responses: {
    success: [
      {
        status: 200,
        description: 'All organizations retrieved successfully',
        type: OrganizationListResponseDto,
      },
    ],
  },
} as const;

export const Docs = {
  createOrganization,
  getOrganizations,
  searchOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  uploadLogo,
  deleteLogo,
  getStats,
  getAllSimpleList,
};
