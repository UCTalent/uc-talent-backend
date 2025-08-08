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

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
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
  @ApiOperation({ summary: 'Get organizations list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'industry', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'size', required: false, type: String })
  @ApiQuery({ name: 'orgType', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: OrganizationListResponseDto,
  })
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
  @ApiOperation({ summary: 'Search organizations' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Organizations search completed successfully',
  })
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
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async findById(@Param('id') id: string) {
    const result = await this.organizationService.getOrganizationById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(result.data),
      message: 'Organization found successfully',
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
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
  @ApiOperation({ summary: 'Delete organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async delete(@Param('id') id: string) {
    await this.organizationService.deleteOrganization(id);
    return ResponseHandler.success({
      data: null,
      message: 'Organization deleted successfully',
    });
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Upload organization logo' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logo uploaded successfully',
  })
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
  @ApiOperation({ summary: 'Delete organization logo' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Logo deleted successfully',
  })
  async deleteLogo(@Param('id') id: string) {
    // TODO: Implement logo deletion functionality
    return ResponseHandler.success({
      data: null,
      message: 'Logo deleted successfully',
    });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get organization statistics' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization statistics retrieved successfully',
  })
  async getStats(@Param('id') id: string) {
    const result = await this.organizationService.getOrganizationById(id);
    return ResponseHandler.success({
      data: result.data.stats,
      message: 'Organization statistics retrieved successfully',
    });
  }

  @Get('all/list')
  @ApiOperation({ summary: 'Get all organizations (simple list)' })
  @ApiResponse({
    status: 200,
    description: 'All organizations retrieved successfully',
    type: OrganizationListResponseDto,
  })
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
