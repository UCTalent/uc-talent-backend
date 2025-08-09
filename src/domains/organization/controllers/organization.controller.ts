import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { OrganizationService } from '@organization/services/organization.service';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationQueryDto } from '@organization/dtos/organization-query.dto';
import {
  OrganizationResponseDto,
  OrganizationListResponseDto,
} from '@organization/dtos/organization-response.dto';
import { Organization } from '@organization/entities/organization.entity';
import { ResponseHandler } from '@shared/utils/response-handler';
import { Docs } from '@documents/organization/organization.document';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(Docs.createOrganization.operation)
  @ApiBody(Docs.createOrganization.body)
  @ApiResponse(Docs.createOrganization.responses.success[0])
  @ApiResponse(Docs.createOrganization.responses.error[0])
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const result = await this.organizationService.createOrganization(
      createOrganizationDto,
    );
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.data),
      statusCode: HttpStatus.CREATED,
      message: 'Organization created successfully',
    });
  }

  @Get()
  @ApiOperation(Docs.getOrganizations.operation)
  @ApiQuery(Docs.getOrganizations.query as any)
  @ApiResponse(Docs.getOrganizations.responses.success[0])
  async getOrganizations(@Query() query: OrganizationQueryDto) {
    const result = await this.organizationService.getOrganizations(query);
    return ResponseHandler.success({
      data: {
        organizations: result.data.organizations.map(org =>
          this.mapToResponseDto(org),
        ),
        pagination: result.data.pagination,
      },
      message: 'Organizations retrieved successfully',
    });
  }

  @Get('search')
  @ApiOperation(Docs.searchOrganizations.operation)
  @ApiQuery(Docs.searchOrganizations.query as any)
  @ApiResponse(Docs.searchOrganizations.responses.success[0])
  async searchOrganizations(
    @Query('query') query: string,
    @Query() filters: any,
  ) {
    const result = await this.organizationService.searchOrganizations(
      query,
      filters,
    );
    return ResponseHandler.success({
      data: result,
      message: 'Organizations search completed successfully',
    });
  }

  @Get(':id')
  @ApiOperation(Docs.getOrganizationById.operation)
  @ApiParam(Docs.getOrganizationById.param)
  @ApiResponse(Docs.getOrganizationById.responses.success[0])
  @ApiResponse(Docs.getOrganizationById.responses.error[0])
  async findById(@Param('id') id: string) {
    const result = await this.organizationService.getOrganizationById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.data),
      message: 'Organization found successfully',
    });
  }

  @Put(':id')
  @ApiOperation(Docs.updateOrganization.operation)
  @ApiParam(Docs.updateOrganization.param)
  @ApiBody(Docs.updateOrganization.body)
  @ApiResponse(Docs.updateOrganization.responses.success[0])
  @ApiResponse(Docs.updateOrganization.responses.error[0])
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const result = await this.organizationService.updateOrganization(
      id,
      updateOrganizationDto,
    );
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.data),
      message: 'Organization updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation(Docs.deleteOrganization.operation)
  @ApiParam(Docs.deleteOrganization.param)
  @ApiResponse(Docs.deleteOrganization.responses.success[0])
  @ApiResponse(Docs.deleteOrganization.responses.error[0])
  async delete(@Param('id') id: string) {
    await this.organizationService.deleteOrganization(id);
    return ResponseHandler.success({
      data: null,
      message: 'Organization deleted successfully',
    });
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation(Docs.uploadLogo.operation)
  @ApiParam(Docs.uploadLogo.param)
  @ApiConsumes('multipart/form-data')
  @ApiBody(Docs.uploadLogo.body as any)
  @ApiResponse(Docs.uploadLogo.responses.success[0])
  async uploadLogo(@Param('id') _id: string, @UploadedFile() file: any) {
    // TODO: Implement logo upload functionality
    return ResponseHandler.success({
      data: {
        logo: {
          url: 'https://storage.example.com/logos/org-uuid.png',
          filename: 'organization-logo.png',
          size: file?.size || 1024000,
          contentType: file?.mimetype || 'image/png',
        },
      },
      message: 'Logo uploaded successfully',
    });
  }

  @Delete(':id/logo')
  @ApiOperation(Docs.deleteLogo.operation)
  @ApiParam(Docs.deleteLogo.param)
  @ApiResponse(Docs.deleteLogo.responses.success[0])
  async deleteLogo(@Param('id') id: string) {
    // TODO: Implement logo deletion functionality
    return ResponseHandler.success({
      data: null,
      message: 'Logo deleted successfully',
    });
  }

  @Get(':id/stats')
  @ApiOperation(Docs.getStats.operation)
  @ApiParam(Docs.getStats.param)
  @ApiResponse(Docs.getStats.responses.success[0])
  async getStats(@Param('id') id: string) {
    const result = await this.organizationService.getOrganizationById(id);
    return ResponseHandler.success({
      data: result.data.stats,
      message: 'Organization statistics retrieved successfully',
    });
  }

  @Get('all/list')
  @ApiOperation(Docs.getAllSimpleList.operation)
  @ApiResponse(Docs.getAllSimpleList.responses.success[0])
  async findAll() {
    const organizations = await this.organizationService.findAll();
    return ResponseHandler.success({
      data: {
        organizations: organizations.map(org => this.mapToResponseDto(org)),
        total: organizations.length,
        page: 1,
        limit: organizations.length,
      },
      message: 'All organizations retrieved successfully',
    });
  }

  private mapToResponseDto(
    organization: Organization,
  ): OrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      about: organization.about,
      address: organization.address,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      foundDate: organization.foundDate,
      website: organization.website,
      github: organization.github,
      linkedin: organization.linkedin,
      twitter: organization.twitter,
      orgType: organization.orgType,
      size: organization.size,
      status: organization.status,
      logo: organization.logoUrl
        ? {
            url: organization.logoUrl,
            filename: organization.logoFilename,
            size: organization.logoSize,
            contentType: organization.logoContentType,
          }
        : undefined,
      industry: organization.industry
        ? {
            id: organization.industry.id,
            name: organization.industry.name,
            description: organization.industry.description,
          }
        : undefined,
      city: organization.city
        ? {
            id: organization.city.id,
            name: organization.city.name,
          }
        : undefined,
      country: organization.country
        ? {
            id: organization.country.id,
            name: organization.country.name,
            code: organization.country.code,
          }
        : undefined,
      jobsCount: organization.jobsCount,
      activeJobsCount: organization.activeJobsCount,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      deletedAt: organization.deletedAt,
    };
  }
}
