import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { Admin } from '@admin/entities/admin.entity';
import { AuditLog } from '@admin/entities/audit-log.entity';
import { SystemSetting } from '@admin/entities/system-setting.entity';
import { AdminRepository } from '@admin/repositories/admin.repository';
import { AuditLogRepository } from '@admin/repositories/audit-log.repository';
import { SystemSettingRepository } from '@admin/repositories/system-setting.repository';
import { AdminUserQueryDto } from '@admin/dtos/admin-user-query.dto';
import { UpdateUserStatusDto } from '@admin/dtos/update-user-status.dto';
import { AdminJobQueryDto } from '@admin/dtos/admin-job-query.dto';
import { UpdateJobStatusDto } from '@admin/dtos/update-job-status.dto';
import { BulkJobActionDto } from '@admin/dtos/bulk-job-action.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(SystemSetting)
    private systemSettingRepository: Repository<SystemSetting>,
    private adminRepo: AdminRepository,
    private auditLogRepo: AuditLogRepository,
    private systemSettingRepo: SystemSettingRepository,
  ) {}

  async getDashboardStats() {
    // Mock data for now - in real implementation, you would inject other repositories
    const totalUsers = 1250;
    const totalJobs = 89;
    const totalTalents = 890;
    const totalPayments = 156;
    const activeJobs = 45;
    const pendingPayments = 23;
    const recentApplications = 12;

    const jobStatusDistribution = [
      { status: 'active', count: 45 },
      { status: 'closed', count: 23 },
      { status: 'expired', count: 21 }
    ];

    const paymentStatusDistribution = [
      { status: 'pending', count: 23 },
      { status: 'completed', count: 133 }
    ];

    const monthlyJobTrends = [
      { month: '2024-01', count: 15 },
      { month: '2024-02', count: 23 }
    ];

    const recentActivities = [
      {
        id: 'activity-1',
        type: 'job_created',
        title: 'New job posted',
        description: 'Senior Developer at Tech Corp',
        timestamp: new Date()
      }
    ];

    return {
      success: true,
      data: {
        stats: {
          totalUsers,
          totalJobs,
          totalTalents,
          totalPayments,
          activeJobs,
          pendingPayments,
          recentApplications
        },
        charts: {
          jobStatusDistribution,
          paymentStatusDistribution,
          monthlyJobTrends
        },
        recentActivities
      }
    };
  }

  async getUsers(query: AdminUserQueryDto) {
    const { page = 1, limit = 20, search, status, role, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.adminRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.talent', 'talent');

    if (search) {
      queryBuilder.where(
        'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async updateUserStatus(id: string, body: UpdateUserStatusDto) {
    const user = await this.adminRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = body.status;
    user.updatedAt = new Date();

    await this.adminRepository.save(user);

    // Log admin action
    await this.auditLogRepo.log({
      action: 'UPDATE_USER_STATUS',
      adminId: body.adminId,
      targetId: id,
      details: { status: body.status, reason: body.reason }
    });

    return {
      success: true,
      data: {
        id: user.id,
        status: user.status,
        updatedAt: user.updatedAt
      }
    };
  }

  async getJobs(query: AdminJobQueryDto) {
    const { page = 1, limit = 20, search, status, organization, speciality, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.adminRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .leftJoinAndSelect('job.city', 'city')
      .leftJoinAndSelect('job.country', 'country');

    if (search) {
      queryBuilder.where('job.title ILIKE :search', { search: `%${search}%` });
    }

    if (status) {
      queryBuilder.andWhere('job.status = :status', { status });
    }

    if (organization) {
      queryBuilder.andWhere('organization.id = :organization', { organization });
    }

    if (speciality) {
      queryBuilder.andWhere('speciality.id = :speciality', { speciality });
    }

    if (dateFrom) {
      queryBuilder.andWhere('job.postedDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('job.postedDate <= :dateTo', { dateTo });
    }

    const [jobs, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('job.createdAt', 'DESC')
      .getManyAndCount();

    // Mock additional stats
    const jobsWithStats = jobs.map((job) => ({
      ...job,
      applicationsCount: Math.floor(Math.random() * 50),
      referralsCount: Math.floor(Math.random() * 20)
    }));

    return {
      success: true,
      data: {
        jobs: jobsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async updateJobStatus(id: string, body: UpdateJobStatusDto) {
    const job = await this.adminRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.status = body.status;
    job.updatedAt = new Date();

    await this.adminRepository.save(job);

    // Log admin action
    await this.auditLogRepo.log({
      action: 'UPDATE_JOB_STATUS',
      adminId: body.adminId,
      targetId: id,
      details: { status: body.status, reason: body.reason }
    });

    return {
      success: true,
      data: {
        id: job.id,
        status: job.status,
        updatedAt: job.updatedAt
      }
    };
  }

  async executeBulkJobAction(body: BulkJobActionDto) {
    const { action, jobIds, reason, adminId } = body;

    const jobs = await this.adminRepository.find({
      where: { id: In(jobIds) }
    });

    switch (action) {
      case 'approve':
        await Promise.all(
          jobs.map(job => {
            job.status = 'active';
            return this.adminRepository.save(job);
          })
        );
        break;
      case 'reject':
        await Promise.all(
          jobs.map(job => {
            job.status = 'rejected';
            return this.adminRepository.save(job);
          })
        );
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    // Log bulk action
    await this.auditLogRepo.log({
      action: 'BULK_JOB_ACTION',
      adminId,
      details: { action, jobIds, reason }
    });

    return {
      success: true,
      data: {
        action,
        processedCount: jobs.length,
        message: `Successfully ${action}ed ${jobs.length} jobs`
      }
    };
  }

  async getSystemSettings() {
    const settings = await this.systemSettingRepo.findAll();
    return {
      success: true,
      data: settings
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
      data: updatedSettings
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

    const queryBuilder = this.auditLogRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.admin', 'admin');

    if (action) {
      queryBuilder.andWhere('auditLog.action = :action', { action });
    }

    if (adminId) {
      queryBuilder.andWhere('auditLog.adminId = :adminId', { adminId });
    }

    if (dateFrom) {
      queryBuilder.andWhere('auditLog.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('auditLog.createdAt <= :dateTo', { dateTo });
    }

    const [auditLogs, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('auditLog.createdAt', 'DESC')
      .getManyAndCount();

    return {
      success: true,
      data: {
        auditLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }
} 