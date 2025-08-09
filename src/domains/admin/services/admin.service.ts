import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, MoreThan, Repository } from 'typeorm';

import type { AdminJobQueryDto } from '@admin/dtos/admin-job-query.dto';
import type { AdminUserQueryDto } from '@admin/dtos/admin-user-query.dto';
import type { BulkJobActionDto } from '@admin/dtos/bulk-job-action.dto';
import type { UpdateJobStatusDto } from '@admin/dtos/update-job-status.dto';
import type { UpdateUserStatusDto } from '@admin/dtos/update-user-status.dto';
import { Admin } from '@admin/entities/admin.entity';
import { AuditLog } from '@admin/entities/audit-log.entity';
import { SystemSetting } from '@admin/entities/system-setting.entity';
import { AdminRepository } from '@admin/repositories/admin.repository';
import { AuditLogRepository } from '@admin/repositories/audit-log.repository';
import { SystemSettingRepository } from '@admin/repositories/system-setting.repository';
import { JobStatus } from '@job/entities/job.entity';
import { JobRepository } from '@job/repositories/job.repository';

@Injectable()
export class AdminService {
  constructor(
    private adminRepo: AdminRepository,
    private auditLogRepo: AuditLogRepository,
    private systemSettingRepo: SystemSettingRepository,
    private jobRepo: JobRepository
  ) {}

  async getDashboardStats() {
    // Get real job statistics
    const jobStats = await this.jobRepo.getJobStats();

    // Mock data for other stats - in real implementation, you would inject other repositories
    const totalUsers = 1250;
    const totalTalents = 890;
    const totalPayments = 156;
    const pendingPayments = 23;
    const recentApplications = 12;

    const jobStatusDistribution = [
      { status: 'active', count: jobStats.active },
      { status: 'closed', count: jobStats.closed },
      { status: 'expired', count: jobStats.expired },
    ];

    const paymentStatusDistribution = [
      { status: 'pending', count: pendingPayments },
      { status: 'completed', count: totalPayments - pendingPayments },
    ];

    const monthlyJobTrends = [
      { month: '2024-01', count: 15 },
      { month: '2024-02', count: 23 },
    ];

    const recentActivities = [
      {
        id: 'activity-1',
        type: 'job_created',
        title: 'New job posted',
        description: 'Senior Developer at Tech Corp',
        timestamp: new Date(),
      },
    ];

    return {
      success: true,
      data: {
        stats: {
          totalUsers,
          totalJobs: jobStats.total,
          totalTalents,
          totalPayments,
          activeJobs: jobStats.active,
          pendingPayments,
          recentApplications,
        },
        charts: {
          jobStatusDistribution,
          paymentStatusDistribution,
          monthlyJobTrends,
        },
        recentActivities,
      },
    };
  }

  async getUsers(query: AdminUserQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    // Use custom repository method with filters
    const { data: users, total } = await this.adminRepo.findWithFilters({
      search,
      status,
      role,
      sortBy,
      sortOrder: sortOrder as 'ASC' | 'DESC',
      skip,
      take: limit,
    });

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async updateUserStatus(id: string, body: UpdateUserStatusDto) {
    const user = await this.adminRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.adminRepo.update(id, {
      status: body.status,
      updatedAt: new Date(),
    });

    // Log admin action
    await this.auditLogRepo.log({
      action: 'UPDATE_USER_STATUS',
      adminId: body.adminId,
      targetId: id,
      details: { status: body.status, reason: body.reason },
    });

    return {
      success: true,
      data: {
        id: updatedUser.id,
        status: updatedUser.status,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }

  async getJobs(query: AdminJobQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      organization,
      speciality,
      dateFrom,
      dateTo,
    } = query;
    const skip = (page - 1) * limit;

    // Use real repository method with admin filters
    const { data: jobs, total } = await this.jobRepo.findWithAdminFilters({
      search,
      status: status as JobStatus,
      organization,
      speciality,
      dateFrom,
      dateTo,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      skip,
      take: limit,
    });

    // Get jobs with application and referral counts
    const jobsWithStats = await this.jobRepo.getJobsWithApplicationCount();

    return {
      success: true,
      data: {
        jobs: jobsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async updateJobStatus(id: string, body: UpdateJobStatusDto) {
    const job = await this.jobRepo.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const updatedJob = await this.jobRepo.update(id, {
      status: body.status as JobStatus,
      updatedAt: new Date(),
    });

    // Log admin action
    await this.auditLogRepo.log({
      action: 'UPDATE_JOB_STATUS',
      adminId: body.adminId,
      targetId: id,
      details: { status: body.status, reason: body.reason },
    });

    return {
      success: true,
      data: {
        id: updatedJob.id,
        status: updatedJob.status,
        updatedAt: updatedJob.updatedAt,
      },
    };
  }

  async executeBulkJobAction(body: BulkJobActionDto) {
    const { action, jobIds, reason, adminId } = body;

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      throw new BadRequestException('Invalid action');
    }

    // Get jobs to ensure they exist
    const jobs = await this.jobRepo.findByIds(jobIds);
    if (jobs.length !== jobIds.length) {
      throw new NotFoundException('Some jobs not found');
    }

    // Update job statuses
    const newStatus =
      action === 'approve' ? JobStatus.PUBLISHED : JobStatus.CLOSED;
    await this.jobRepo.bulkUpdateStatus(jobIds, newStatus);

    // Log bulk action
    await this.auditLogRepo.log({
      action: 'BULK_JOB_ACTION',
      adminId,
      details: { action, jobIds, reason },
    });

    return {
      success: true,
      data: {
        action,
        processedCount: jobs.length,
        message: `Successfully ${action}ed ${jobs.length} jobs`,
      },
    };
  }

  async getSystemSettings() {
    const settings = await this.systemSettingRepo.findAll();
    return {
      success: true,
      data: settings,
    };
  }

  async updateSystemSettings(settings: Record<string, any>) {
    const updatedSettings = [];

    for (const [key, value] of Object.entries(settings)) {
      const setting = await this.systemSettingRepo.setValue(key, value);
      updatedSettings.push(setting);
    }

    return {
      success: true,
      data: updatedSettings,
    };
  }

  async getAuditLogs(query: {
    page?: number;
    limit?: number;
    action?: string;
    adminId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page = 1, limit = 20, action, adminId, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    // Use custom repository method with filters
    const { data: auditLogs, total } = await this.auditLogRepo.findWithFilters({
      action,
      adminId,
      dateFrom,
      dateTo,
      skip,
      take: limit,
    });

    return {
      success: true,
      data: {
        auditLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}
