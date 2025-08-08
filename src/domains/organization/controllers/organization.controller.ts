import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { OrganizationService } from '@organization/services/organization.service';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationQueryDto } from '@organization/dtos/organization-query.dto';
import { OrganizationResponseDto, OrganizationListResponseDto } from '@organization/dtos/organization-response.dto';
import { Organization } from '@organization/entities/organization.entity';

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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            organizations: { type: 'array' },
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
  async getOrganizations(@Query() query: OrganizationQueryDto) {
    return this.organizationService.getOrganizations(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search organizations' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Organizations search results',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            organizations: { type: 'array' },
            searchStats: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                totalResults: { type: 'number' },
                searchTime: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async searchOrganizations(@Query('query') query: string, @Query() filters: any) {
    return this.organizationService.searchOrganizations(query, filters);
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async findById(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Patch(':id')
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(id, updateOrganizationDto);
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async delete(@Param('id') id: string) {
    return this.organizationService.deleteOrganization(id);
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
  @ApiResponse({
    status: 200,
    description: 'Logo uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            logo: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                filename: { type: 'string' },
                size: { type: 'number' },
                contentType: { type: 'string' },
                dimensions: {
                  type: 'object',
                  properties: {
                    width: { type: 'number' },
                    height: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async uploadLogo(@Param('id') id: string, @UploadedFile() file: any) {
    // TODO: Implement logo upload
    return {
      success: true,
      data: {
        logo: {
          url: 'https://storage.example.com/logos/org-uuid.png',
          filename: 'organization-logo.png',
          size: file?.size || 1024000,
          contentType: file?.mimetype || 'image/png',
          dimensions: {
            width: 500,
            height: 500
          }
        }
      }
    };
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  async deleteLogo(@Param('id') id: string) {
    // TODO: Implement logo deletion
    return {
      success: true,
      message: 'Logo deleted successfully'
    };
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            jobs: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                active: { type: 'number' },
                closed: { type: 'number' },
                expired: { type: 'number' }
              }
            },
            applications: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                pending: { type: 'number' },
                reviewed: { type: 'number' },
                hired: { type: 'number' }
              }
            },
            referrals: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                successful: { type: 'number' },
                pending: { type: 'number' }
              }
            },
            payments: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                pending: { type: 'number' },
                completed: { type: 'number' }
              }
            },
            growth: {
              type: 'object',
              properties: {
                jobsThisMonth: { type: 'number' },
                jobsLastMonth: { type: 'number' },
                growthRate: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getStats(@Param('id') id: string) {
    // TODO: Implement statistics calculation
    return {
      success: true,
      data: {
        jobs: {
          total: 15,
          active: 8,
          closed: 5,
          expired: 2
        },
        applications: {
          total: 150,
          pending: 45,
          reviewed: 80,
          hired: 25
        },
        referrals: {
          total: 30,
          successful: 12,
          pending: 18
        },
        payments: {
          total: 25000,
          pending: 5000,
          completed: 20000
        },
        growth: {
          jobsThisMonth: 5,
          jobsLastMonth: 3,
          growthRate: 66.67
        }
      }
    };
  }

  // Legacy methods for backward compatibility
  async findAll(): Promise<OrganizationListResponseDto> {
    const organizations = await this.organizationService.findAll();
    return {
      organizations: organizations.map(org => this.mapToResponseDto(org)),
      total: organizations.length,
      page: 1,
      limit: organizations.length,
    };
  }

  private mapToResponseDto(organization: Organization): OrganizationResponseDto {
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
      logo: organization.logoUrl ? {
        url: organization.logoUrl,
        filename: organization.logoFilename,
        size: organization.logoSize,
        contentType: organization.logoContentType
      } : undefined,
      industry: organization.industry ? {
        id: organization.industry.id,
        name: organization.industry.name,
        description: organization.industry.description
      } : undefined,
      city: organization.city ? {
        id: organization.city.id,
        name: organization.city.name
      } : undefined,
      country: organization.country ? {
        id: organization.country.id,
        name: organization.country.name
      } : undefined,
      jobsCount: organization.jobsCount,
      activeJobsCount: organization.activeJobsCount,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      deletedAt: organization.deletedAt,
    };
  }
} 