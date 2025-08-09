import { Document } from '@documents/interface';
import { CreatePartnerDto } from '@domains/partner/dtos/create-partner.dto';
import { UpdatePartnerDto } from '@domains/partner/dtos/update-partner.dto';
import {
  PartnerQueryDto,
  PartnerHostQueryDto,
} from '@domains/partner/dtos/partner-query.dto';
import { CreatePartnerHostDto } from '@domains/partner/dtos/create-partner-host.dto';
import { UpdatePartnerHostDto } from '@domains/partner/dtos/update-partner-host.dto';
import {
  CreatePartnerNetworkDto,
  UpdatePartnerNetworkDto,
} from '@domains/partner/dtos/partner-network.dto';
import {
  PartnerResponseDto,
  PartnerHostResponseDto,
  PartnerNetworkResponseDto,
} from '@domains/partner/dtos/partner-response.dto';

// Partners
const getPartners: Document = {
  operation: { summary: 'Get partners list' },
  query: { type: PartnerQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partners retrieved successfully',
        type: [PartnerResponseDto] as any,
      },
    ],
  },
} as const;

const getPartnerById: Document = {
  operation: { summary: 'Get partner details' },
  param: { name: 'id', description: 'Partner ID' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partner retrieved successfully',
        type: PartnerResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Partner not found' }],
  },
} as const;

const createPartner: Document = {
  operation: { summary: 'Create new partner' },
  body: { type: CreatePartnerDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Partner created successfully',
        type: PartnerResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request' }],
  },
} as const;

const updatePartner: Document = {
  operation: { summary: 'Update partner' },
  param: { name: 'id', description: 'Partner ID' },
  body: { type: UpdatePartnerDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partner updated successfully',
        type: PartnerResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Partner not found' }],
  },
} as const;

const deletePartner: Document = {
  operation: { summary: 'Delete partner' },
  param: { name: 'id', description: 'Partner ID' },
  responses: {
    success: [{ status: 200, description: 'Partner deleted successfully' }],
    error: [{ status: 404, description: 'Partner not found' }],
  },
} as const;

const getPartnerStats: Document = {
  operation: { summary: 'Get partner statistics' },
  param: { name: 'id', description: 'Partner ID' },
  responses: {
    success: [
      { status: 200, description: 'Partner statistics retrieved successfully' },
    ],
    error: [{ status: 404, description: 'Partner not found' }],
  },
} as const;

// Partner Hosts
const getPartnerHosts: Document = {
  operation: { summary: 'Get partner hosts list' },
  query: { type: PartnerHostQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partner hosts retrieved successfully',
        type: [PartnerHostResponseDto] as any,
      },
    ],
  },
} as const;

const getPartnerHostById: Document = {
  operation: { summary: 'Get partner host details' },
  param: { name: 'id', description: 'Partner Host ID' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partner host retrieved successfully',
        type: PartnerHostResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Partner host not found' }],
  },
} as const;

const createPartnerHost: Document = {
  operation: { summary: 'Create new partner host' },
  body: { type: CreatePartnerHostDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Partner host created successfully',
        type: PartnerHostResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request' }],
  },
} as const;

const updatePartnerHost: Document = {
  operation: { summary: 'Update partner host' },
  param: { name: 'id', description: 'Partner Host ID' },
  body: { type: UpdatePartnerHostDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Partner host updated successfully',
        type: PartnerHostResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Partner host not found' }],
  },
} as const;

const regenerateHostToken: Document = {
  operation: { summary: 'Regenerate access token for partner host' },
  param: { name: 'id', description: 'Partner Host ID' },
  responses: {
    success: [
      { status: 200, description: 'Access token regenerated successfully' },
    ],
    error: [{ status: 404, description: 'Partner host not found' }],
  },
} as const;

const getPartnerNetworks: Document = {
  operation: { summary: 'Get partner host networks' },
  param: { name: 'hostId', description: 'Partner Host ID' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Networks retrieved successfully',
        type: [PartnerNetworkResponseDto] as any,
      },
    ],
  },
} as const;

const addNetworkToPartnerHost: Document = {
  operation: { summary: 'Add network to partner host' },
  param: { name: 'hostId', description: 'Partner Host ID' },
  body: { type: CreatePartnerNetworkDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Network added successfully',
        type: PartnerNetworkResponseDto,
      },
    ],
    error: [{ status: 400, description: 'Bad request' }],
  },
} as const;

const updatePartnerNetwork: Document = {
  operation: { summary: 'Update partner host network' },
  param: { name: 'hostId', description: 'Partner Host ID' },
  body: { type: UpdatePartnerNetworkDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Network updated successfully',
        type: PartnerNetworkResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Network not found' }],
  },
} as const;

// Partner Auth
const validatePartnerToken: Document = {
  operation: { summary: 'Validate partner token' },
  responses: {
    success: [{ status: 200, description: 'Token validated successfully' }],
    error: [{ status: 401, description: 'Invalid token' }],
  },
} as const;

export const Docs = {
  // partners
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerStats,
  // hosts
  getPartnerHosts,
  getPartnerHostById,
  createPartnerHost,
  updatePartnerHost,
  regenerateHostToken,
  getPartnerNetworks,
  addNetworkToPartnerHost,
  updatePartnerNetwork,
  // auth
  validatePartnerToken,
};
