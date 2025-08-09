import { Document } from '@documents/interface';
import { AdminUserQueryDto } from '@admin/dtos/admin-user-query.dto';
import { UpdateUserStatusDto } from '@admin/dtos/update-user-status.dto';
import { AdminJobQueryDto } from '@admin/dtos/admin-job-query.dto';
import { UpdateJobStatusDto } from '@admin/dtos/update-job-status.dto';
import { BulkJobActionDto } from '@admin/dtos/bulk-job-action.dto';

const dashboard: Document = {
  operation: { summary: 'Get dashboard statistics' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Dashboard statistics retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                stats: { type: 'object' },
                charts: { type: 'object' },
                recentActivities: { type: 'array' },
              },
            },
          },
        },
      },
    ],
  },
} as const;

const getUsers: Document = {
  operation: { summary: 'Get users list' },
  query: { type: AdminUserQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Users list retrieved successfully',
      },
    ],
  },
} as const;

const updateUserStatus: Document = {
  operation: { summary: 'Update user status' },
  param: { name: 'id', description: 'User ID' },
  body: { type: UpdateUserStatusDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'User status updated successfully',
      },
    ],
  },
} as const;

const getJobs: Document = {
  operation: { summary: 'Get jobs list' },
  query: { type: AdminJobQueryDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Jobs list retrieved successfully',
      },
    ],
  },
} as const;

const updateJobStatus: Document = {
  operation: { summary: 'Update job status' },
  param: { name: 'id', description: 'Job ID' },
  body: { type: UpdateJobStatusDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Job status updated successfully',
      },
    ],
  },
} as const;

const bulkJobActions: Document = {
  operation: { summary: 'Execute bulk job actions' },
  body: { type: BulkJobActionDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Bulk action executed successfully',
      },
    ],
  },
} as const;

const getTalents: Document = {
  operation: { summary: 'Get talents list' },
  query: { type: Object as any },
  responses: {
    success: [
      { status: 200, description: 'Talents list retrieved successfully' },
    ],
  },
} as const;

const reviewTalent: Document = {
  operation: { summary: 'Review talent profile' },
  param: { name: 'id', description: 'Talent ID' },
  body: { type: Object as any },
  responses: {
    success: [
      { status: 200, description: 'Talent review completed successfully' },
    ],
  },
} as const;

const getPaymentDistributions: Document = {
  operation: { summary: 'Get payment distributions' },
  query: { type: Object as any },
  responses: {
    success: [
      {
        status: 200,
        description: 'Payment distributions retrieved successfully',
      },
    ],
  },
} as const;

const approvePayment: Document = {
  operation: { summary: 'Approve payment' },
  param: { name: 'id', description: 'Payment distribution ID' },
  body: { type: Object as any },
  responses: {
    success: [{ status: 200, description: 'Payment approved successfully' }],
  },
} as const;

const getSystemSettings: Document = {
  operation: { summary: 'Get system settings' },
  responses: {
    success: [
      { status: 200, description: 'System settings retrieved successfully' },
    ],
  },
} as const;

const updateSystemSettings: Document = {
  operation: { summary: 'Update system settings' },
  body: { type: Object as any },
  responses: {
    success: [
      { status: 200, description: 'System settings updated successfully' },
    ],
  },
} as const;

const getAuditLogs: Document = {
  operation: { summary: 'Get audit logs' },
  query: { type: Object as any },
  responses: {
    success: [
      { status: 200, description: 'Audit logs retrieved successfully' },
    ],
  },
} as const;

export const Docs = {
  dashboard,
  getUsers,
  updateUserStatus,
  getJobs,
  updateJobStatus,
  bulkJobActions,
  getTalents,
  reviewTalent,
  getPaymentDistributions,
  approvePayment,
  getSystemSettings,
  updateSystemSettings,
  getAuditLogs,
};
