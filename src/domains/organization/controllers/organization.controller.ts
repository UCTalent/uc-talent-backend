import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrganizationService } from '@organization/services/organization.service';
import { CreateOrganizationDto } from '@organization/dtos/create-organization.dto';
import { UpdateOrganizationDto } from '@organization/dtos/update-organization.dto';
import { OrganizationResponseDto, OrganizationListResponseDto } from '@organization/dtos/organization-response.dto';
import { Organization } from '@organization/entities/organization.entity';

@ApiTags('organizations')
@Controller('api/v1/organizations')
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
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const organization = await this.organizationService.create(createOrganizationDto);
    return this.mapToResponseDto(organization);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: OrganizationListResponseDto,
  })
  async findAll(): Promise<OrganizationListResponseDto> {
    const organizations = await this.organizationService.findAll();
    return {
      organizations: organizations.map(org => this.mapToResponseDto(org)),
      total: organizations.length,
      page: 1,
      limit: organizations.length,
    };
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
  async findById(@Param('id') id: string): Promise<OrganizationResponseDto> {
    const organization = await this.organizationService.findById(id);
    return this.mapToResponseDto(organization);
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
  ): Promise<OrganizationResponseDto> {
    const organization = await this.organizationService.update(id, updateOrganizationDto);
    return this.mapToResponseDto(organization);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.organizationService.delete(id);
  }

  private mapToResponseDto(organization: Organization): OrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      about: organization.about,
      website: organization.website,
      github: organization.github,
      linkedin: organization.linkedin,
      twitter: organization.twitter,
      logo: organization.logo,
      industryId: organization.industryId,
      cityId: organization.cityId,
      countryId: organization.countryId,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      deletedAt: organization.deletedAt,
    };
  }
} 