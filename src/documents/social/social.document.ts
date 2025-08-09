import type { Document } from '@documents/interface';
import { LinkSocialAccountDto } from '@domains/social/dtos/link-social-account.dto';
import { SocialAuthDto } from '@domains/social/dtos/social-auth.dto';
import {
  SocialAccountResponseDto,
  SocialProfileResponseDto,
  SocialSettingsResponseDto,
  SyncResultResponseDto,
} from '@domains/social/dtos/social-response.dto';
import { SocialSearchDto } from '@domains/social/dtos/social-search.dto';
import { SocialSettingsDto } from '@domains/social/dtos/social-settings.dto';

const getUserSocialAccounts: Document = {
  operation: { summary: 'Get user social accounts' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Social accounts retrieved successfully',
        type: [SocialAccountResponseDto] as any,
      },
    ],
  },
} as const;

const linkSocialAccount: Document = {
  operation: { summary: 'Link social account' },
  body: { type: LinkSocialAccountDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'Social account linked successfully',
        type: SocialAccountResponseDto,
      },
    ],
    error: [{ status: 422, description: 'Validation error' }],
  },
} as const;

const unlinkSocialAccount: Document = {
  operation: { summary: 'Unlink social account' },
  param: { name: 'id', description: 'Social account ID' },
  responses: {
    success: [
      { status: 204, description: 'Social account unlinked successfully' },
    ],
    error: [{ status: 404, description: 'Social account not found' }],
  },
} as const;

const syncSocialAccount: Document = {
  operation: { summary: 'Sync social account data' },
  param: { name: 'id', description: 'Social account ID' },
  responses: {
    success: [
      { status: 200, description: 'Social account synced successfully' },
    ],
    error: [{ status: 404, description: 'Social account not found' }],
  },
} as const;

const syncAllSocialAccounts: Document = {
  operation: { summary: 'Sync all social accounts' },
  responses: {
    success: [
      {
        status: 200,
        description: 'All social accounts synced successfully',
        type: [SyncResultResponseDto] as any,
      },
    ],
  },
} as const;

const refreshToken: Document = {
  operation: { summary: 'Refresh social account token' },
  param: { name: 'id', description: 'Social account ID' },
  responses: {
    success: [{ status: 200, description: 'Token refreshed successfully' }],
    error: [{ status: 404, description: 'Social account not found' }],
  },
} as const;

const searchSocialProfiles: Document = {
  operation: { summary: 'Search users by social profile' },
  query: { type: SocialSearchDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Search results retrieved successfully',
        type: [SocialProfileResponseDto] as any,
      },
    ],
  },
} as const;

const getSocialSettings: Document = {
  operation: { summary: 'Get social privacy settings' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Settings retrieved successfully',
        type: SocialSettingsResponseDto,
      },
    ],
  },
} as const;

const updateSocialSettings: Document = {
  operation: { summary: 'Update social privacy settings' },
  body: { type: SocialSettingsDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Settings updated successfully',
        type: SocialSettingsResponseDto,
      },
    ],
  },
} as const;

const findByUserIdLegacy: Document = {
  operation: { summary: 'Get social accounts by user ID (legacy)' },
  param: { name: 'userId', description: 'User ID' },
  responses: {
    success: [
      { status: 200, description: 'Social accounts found successfully' },
    ],
  },
} as const;

const findByIdLegacy: Document = {
  operation: { summary: 'Get social account by ID (legacy)' },
  param: { name: 'id', description: 'Social account ID' },
  responses: {
    success: [
      { status: 200, description: 'Social account found successfully' },
    ],
    error: [{ status: 404, description: 'Social account not found' }],
  },
} as const;

const deleteLegacy: Document = {
  operation: { summary: 'Delete social account by ID (legacy)' },
  param: { name: 'id', description: 'Social account ID' },
  responses: {
    success: [
      { status: 204, description: 'Social account deleted successfully' },
    ],
    error: [{ status: 404, description: 'Social account not found' }],
  },
} as const;

const authenticateWithSocial: Document = {
  operation: { summary: 'Authenticate with social provider' },
  param: {
    name: 'provider',
    description: 'Social provider',
    enum: [
      'facebook',
      'x',
      'twitter',
      'linkedin',
      'github',
      'instagram',
      'discord',
      'telegram',
    ],
  } as any,
  body: { type: SocialAuthDto },
  responses: {
    success: [{ status: 200, description: 'Authentication successful' }],
    error: [{ status: 400, description: 'Authentication failed' }],
  },
} as const;

export const Docs = {
  getUserSocialAccounts,
  linkSocialAccount,
  unlinkSocialAccount,
  syncSocialAccount,
  syncAllSocialAccounts,
  refreshToken,
  searchSocialProfiles,
  getSocialSettings,
  updateSocialSettings,
  findByUserIdLegacy,
  findByIdLegacy,
  deleteLegacy,
  authenticateWithSocial,
};
