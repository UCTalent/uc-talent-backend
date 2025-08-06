import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from '../services/admin.service';
import { AdminUserQueryDto } from '../dtos/admin-user-query.dto';
import { UpdateUserStatusDto } from '../dtos/update-user-status.dto';
import { AdminJobQueryDto } from '../dtos/admin-job-query.dto';
import { UpdateJobStatusDto } from '../dtos/update-job-status.dto';
import { BulkJobActionDto } from '../dtos/bulk-job-action.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getDashboardStats: jest.fn(),
            getUsers: jest.fn(),
            updateUserStatus: jest.fn(),
            getJobs: jest.fn(),
            updateJobStatus: jest.fn(),
            executeBulkJobAction: jest.fn(),
            getSystemSettings: jest.fn(),
            updateSystemSettings: jest.fn(),
            getAuditLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard statistics', async () => {
      const expectedResult = {
        success: true,
        data: {
          stats: {
            totalUsers: 1250,
            totalJobs: 89,
            totalTalents: 890,
            totalPayments: 156,
            activeJobs: 45,
            pendingPayments: 23,
            recentApplications: 12
          },
          charts: {
            jobStatusDistribution: [],
            paymentStatusDistribution: [],
            monthlyJobTrends: []
          },
          recentActivities: []
        }
      };

      jest.spyOn(service, 'getDashboardStats').mockResolvedValue(expectedResult);

      const result = await controller.getDashboard();

      expect(result).toBe(expectedResult);
      expect(service.getDashboardStats).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return users list', async () => {
      const query: AdminUserQueryDto = {
        page: 1,
        limit: 20,
        search: 'john',
        status: 'active',
        role: 'user',
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };

      const expectedResult = {
        success: true,
        data: {
          users: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      };

      jest.spyOn(service, 'getUsers').mockResolvedValue(expectedResult);

      const result = await controller.getUsers(query);

      expect(result).toBe(expectedResult);
      expect(service.getUsers).toHaveBeenCalledWith(query);
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      const userId = 'user-uuid';
      const body: UpdateUserStatusDto = {
        status: 'suspended',
        reason: 'Violation of terms',
        adminId: 'admin-uuid'
      };

      const expectedResult = {
        success: true,
        data: {
          id: userId,
          status: 'suspended',
          updatedAt: new Date()
        }
      };

      jest.spyOn(service, 'updateUserStatus').mockResolvedValue(expectedResult);

      const result = await controller.updateUserStatus(userId, body);

      expect(result).toBe(expectedResult);
      expect(service.updateUserStatus).toHaveBeenCalledWith(userId, body);
    });
  });

  describe('getJobs', () => {
    it('should return jobs list', async () => {
      const query: AdminJobQueryDto = {
        page: 1,
        limit: 20,
        search: 'developer',
        status: 'active',
        organization: 'org-uuid',
        speciality: 'spec-uuid',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      const expectedResult = {
        success: true,
        data: {
          jobs: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      };

      jest.spyOn(service, 'getJobs').mockResolvedValue(expectedResult);

      const result = await controller.getJobs(query);

      expect(result).toBe(expectedResult);
      expect(service.getJobs).toHaveBeenCalledWith(query);
    });
  });

  describe('updateJobStatus', () => {
    it('should update job status', async () => {
      const jobId = 'job-uuid';
      const body: UpdateJobStatusDto = {
        status: 'active',
        reason: 'Approved by admin',
        adminId: 'admin-uuid'
      };

      const expectedResult = {
        success: true,
        data: {
          id: jobId,
          status: 'active',
          updatedAt: new Date()
        }
      };

      jest.spyOn(service, 'updateJobStatus').mockResolvedValue(expectedResult);

      const result = await controller.updateJobStatus(jobId, body);

      expect(result).toBe(expectedResult);
      expect(service.updateJobStatus).toHaveBeenCalledWith(jobId, body);
    });
  });

  describe('bulkJobActions', () => {
    it('should execute bulk job actions', async () => {
      const body: BulkJobActionDto = {
        action: 'approve',
        jobIds: ['job-1', 'job-2', 'job-3'],
        reason: 'Bulk approval',
        adminId: 'admin-uuid'
      };

      const expectedResult = {
        success: true,
        data: {
          action: 'approve',
          processedCount: 3,
          message: 'Successfully approved 3 jobs'
        }
      };

      jest.spyOn(service, 'executeBulkJobAction').mockResolvedValue(expectedResult);

      const result = await controller.bulkJobActions(body);

      expect(result).toBe(expectedResult);
      expect(service.executeBulkJobAction).toHaveBeenCalledWith(body);
    });
  });

  describe('getSystemSettings', () => {
    it('should return system settings', async () => {
      const expectedResult = {
        success: true,
        data: []
      };

      jest.spyOn(service, 'getSystemSettings').mockResolvedValue(expectedResult);

      const result = await controller.getSystemSettings();

      expect(result).toBe(expectedResult);
      expect(service.getSystemSettings).toHaveBeenCalled();
    });
  });

  describe('updateSystemSettings', () => {
    it('should update system settings', async () => {
      const settings = {
        platformFee: 0.05,
        maxJobDuration: 90,
        autoApproveJobs: false,
        maintenanceMode: false
      };

      const expectedResult = {
        success: true,
        data: []
      };

      jest.spyOn(service, 'updateSystemSettings').mockResolvedValue(expectedResult);

      const result = await controller.updateSystemSettings(settings);

      expect(result).toBe(expectedResult);
      expect(service.updateSystemSettings).toHaveBeenCalledWith(settings);
    });
  });

  describe('getAuditLogs', () => {
    it('should return audit logs', async () => {
      const query = {
        page: 1,
        limit: 20,
        action: 'UPDATE_USER_STATUS',
        adminId: 'admin-uuid',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      const expectedResult = {
        success: true,
        data: {
          auditLogs: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      };

      jest.spyOn(service, 'getAuditLogs').mockResolvedValue(expectedResult);

      const result = await controller.getAuditLogs(query);

      expect(result).toBe(expectedResult);
      expect(service.getAuditLogs).toHaveBeenCalledWith(query);
    });
  });
}); 