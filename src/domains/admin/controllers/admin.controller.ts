import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminJobQueryDto } from '@admin/dtos/admin-job-query.dto';
import { AdminUserQueryDto } from '@admin/dtos/admin-user-query.dto';
import { BulkJobActionDto } from '@admin/dtos/bulk-job-action.dto';
import { UpdateJobStatusDto } from '@admin/dtos/update-job-status.dto';
import { UpdateUserStatusDto } from '@admin/dtos/update-user-status.dto';
import { AdminService } from '@admin/services/admin.service';
import { Docs } from '@documents/admin/admin.document';
import {
  AdminGuard,
  AdminUser,
  CurrentAdmin,
} from '@shared/cross-cutting/authorization';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.dashboard.operation)
  @ApiResponse(Docs.dashboard.responses.success[0])
  async getDashboard(@CurrentAdmin() admin: AdminUser) {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getUsers.operation)
  @ApiQuery(Docs.getUsers.query as any)
  @ApiResponse(Docs.getUsers.responses.success[0])
  async getUsers(
    @Query() query: AdminUserQueryDto,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/status')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.updateUserStatus.operation)
  @ApiParam(Docs.updateUserStatus.param)
  @ApiBody(Docs.updateUserStatus.body)
  @ApiResponse(Docs.updateUserStatus.responses.success[0])
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.updateUserStatus(id, body);
  }

  @Get('jobs')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getJobs.operation)
  @ApiQuery(Docs.getJobs.query as any)
  @ApiResponse(Docs.getJobs.responses.success[0])
  async getJobs(
    @Query() query: AdminJobQueryDto,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.getJobs(query);
  }

  @Patch('jobs/:id/status')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.updateJobStatus.operation)
  @ApiParam(Docs.updateJobStatus.param)
  @ApiBody(Docs.updateJobStatus.body)
  @ApiResponse(Docs.updateJobStatus.responses.success[0])
  async updateJobStatus(
    @Param('id') id: string,
    @Body() body: UpdateJobStatusDto,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.updateJobStatus(id, body);
  }

  @Post('jobs/bulk-actions')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.bulkJobActions.operation)
  @ApiBody(Docs.bulkJobActions.body)
  @ApiResponse(Docs.bulkJobActions.responses.success[0])
  async bulkJobActions(
    @Body() body: BulkJobActionDto,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.executeBulkJobAction(body);
  }

  @Get('talents')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getTalents.operation)
  @ApiQuery(Docs.getTalents.query as any)
  @ApiResponse(Docs.getTalents.responses.success[0])
  async getTalents(@Query() query: any, @CurrentAdmin() admin: AdminUser) {
    // TODO: Implement talent management
    return {
      success: true,
      data: {
        talents: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }

  @Post('talents/:id/review')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.reviewTalent.operation)
  @ApiParam(Docs.reviewTalent.param)
  @ApiBody(Docs.reviewTalent.body)
  @ApiResponse(Docs.reviewTalent.responses.success[0])
  async reviewTalent(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentAdmin() admin: AdminUser
  ) {
    // TODO: Implement talent review
    return {
      success: true,
      data: {
        id,
        action: body.action,
        status: body.status,
      },
    };
  }

  @Get('payment-distributions')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getPaymentDistributions.operation)
  @ApiQuery(Docs.getPaymentDistributions.query as any)
  @ApiResponse(Docs.getPaymentDistributions.responses.success[0])
  async getPaymentDistributions(
    @Query() query: any,
    @CurrentAdmin() admin: AdminUser
  ) {
    // TODO: Implement payment management
    return {
      success: true,
      data: {
        paymentDistributions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }

  @Post('payment-distributions/:id/approve')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.approvePayment.operation)
  @ApiParam(Docs.approvePayment.param)
  @ApiBody(Docs.approvePayment.body)
  @ApiResponse(Docs.approvePayment.responses.success[0])
  async approvePayment(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentAdmin() admin: AdminUser
  ) {
    // TODO: Implement payment approval
    return {
      success: true,
      data: {
        id,
        approved: body.approved,
        transactionHash: body.transactionHash,
      },
    };
  }

  @Get('settings')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getSystemSettings.operation)
  @ApiResponse(Docs.getSystemSettings.responses.success[0])
  async getSystemSettings(@CurrentAdmin() admin: AdminUser) {
    return this.adminService.getSystemSettings();
  }

  @Patch('settings')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.updateSystemSettings.operation)
  @ApiBody(Docs.updateSystemSettings.body)
  @ApiResponse(Docs.updateSystemSettings.responses.success[0])
  async updateSystemSettings(
    @Body() settings: Record<string, any>,
    @CurrentAdmin() admin: AdminUser
  ) {
    return this.adminService.updateSystemSettings(settings);
  }

  @Get('audit-logs')
  @UseGuards(AdminGuard)
  @ApiOperation(Docs.getAuditLogs.operation)
  @ApiQuery(Docs.getAuditLogs.query as any)
  @ApiResponse(Docs.getAuditLogs.responses.success[0])
  async getAuditLogs(@Query() query: any, @CurrentAdmin() admin: AdminUser) {
    return this.adminService.getAuditLogs(query);
  }
}
