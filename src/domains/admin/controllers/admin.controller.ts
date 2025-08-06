import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AdminService } from '@admin/services/admin.service';
import { AdminUserQueryDto } from '@admin/dtos/admin-user-query.dto';
import { UpdateUserStatusDto } from '@admin/dtos/update-user-status.dto';
import { AdminJobQueryDto } from '@admin/dtos/admin-job-query.dto';
import { UpdateJobStatusDto } from '@admin/dtos/update-job-status.dto';
import { BulkJobActionDto } from '@admin/dtos/bulk-job-action.dto';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                totalUsers: { type: 'number' },
                totalJobs: { type: 'number' },
                totalTalents: { type: 'number' },
                totalPayments: { type: 'number' },
                activeJobs: { type: 'number' },
                pendingPayments: { type: 'number' },
                recentApplications: { type: 'number' }
              }
            },
            charts: {
              type: 'object',
              properties: {
                jobStatusDistribution: { type: 'array' },
                paymentStatusDistribution: { type: 'array' },
                monthlyJobTrends: { type: 'array' }
              }
            },
            recentActivities: { type: 'array' }
          }
        }
      }
    }
  })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get users list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            users: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getUsers(@Query() query: AdminUserQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/status')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto
  ) {
    return this.adminService.updateUserStatus(id, body);
  }

  @Get('jobs')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get jobs list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'organization', required: false, type: String })
  @ApiQuery({ name: 'speciality', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Jobs list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            jobs: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getJobs(@Query() query: AdminJobQueryDto) {
    return this.adminService.getJobs(query);
  }

  @Patch('jobs/:id/status')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Update job status' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({
    status: 200,
    description: 'Job status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async updateJobStatus(
    @Param('id') id: string,
    @Body() body: UpdateJobStatusDto
  ) {
    return this.adminService.updateJobStatus(id, body);
  }

  @Post('jobs/bulk-actions')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Execute bulk job actions' })
  @ApiResponse({
    status: 200,
    description: 'Bulk action executed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            processedCount: { type: 'number' },
            message: { type: 'string' }
          }
        }
      }
    }
  })
  async bulkJobActions(@Body() body: BulkJobActionDto) {
    return this.adminService.executeBulkJobAction(body);
  }

  @Get('talents')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get talents list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'experienceLevel', required: false, type: String })
  @ApiQuery({ name: 'englishProficiency', required: false, type: String })
  @ApiQuery({ name: 'speciality', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Talents list retrieved successfully'
  })
  async getTalents(@Query() query: any) {
    // TODO: Implement talent management
    return {
      success: true,
      data: {
        talents: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      }
    };
  }

  @Post('talents/:id/review')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Review talent profile' })
  @ApiParam({ name: 'id', description: 'Talent ID' })
  @ApiResponse({
    status: 200,
    description: 'Talent review completed successfully'
  })
  async reviewTalent(@Param('id') id: string, @Body() body: any) {
    // TODO: Implement talent review
    return {
      success: true,
      data: {
        id,
        action: body.action,
        status: body.status
      }
    };
  }

  @Get('payment-distributions')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get payment distributions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'paymentType', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Payment distributions retrieved successfully'
  })
  async getPaymentDistributions(@Query() query: any) {
    // TODO: Implement payment management
    return {
      success: true,
      data: {
        paymentDistributions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      }
    };
  }

  @Post('payment-distributions/:id/approve')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Approve payment' })
  @ApiParam({ name: 'id', description: 'Payment distribution ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment approved successfully'
  })
  async approvePayment(@Param('id') id: string, @Body() body: any) {
    // TODO: Implement payment approval
    return {
      success: true,
      data: {
        id,
        approved: body.approved,
        transactionHash: body.transactionHash
      }
    };
  }

  @Get('settings')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({
    status: 200,
    description: 'System settings retrieved successfully'
  })
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Patch('settings')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({
    status: 200,
    description: 'System settings updated successfully'
  })
  async updateSystemSettings(@Body() settings: Record<string, any>) {
    return this.adminService.updateSystemSettings(settings);
  }

  @Get('audit-logs')
  @UseGuards() // Add AdminGuard here
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'adminId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully'
  })
  async getAuditLogs(@Query() query: any) {
    return this.adminService.getAuditLogs(query);
  }
} 