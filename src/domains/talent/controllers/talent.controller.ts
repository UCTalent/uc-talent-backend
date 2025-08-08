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
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TalentService } from '@talent/services/talent.service';
import { CreateTalentDto } from '@talent/dtos/create-talent.dto';
import { UpdateTalentDto } from '@talent/dtos/update-talent.dto';
import { TalentIndexQueryDto } from '@talent/dtos/talent-index-query.dto';
import { CreateExperienceDto } from '@talent/dtos/create-experience.dto';
import { CreateEducationDto } from '@talent/dtos/create-education.dto';
import { CreateExternalLinkDto } from '@talent/dtos/create-external-link.dto';
import { TalentResponseDto, TalentListResponseDto } from '@talent/dtos/talent-response.dto';
import { Talent } from '@talent/entities/talent.entity';

@ApiTags('talents')
@Controller('talents')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new talent' })
  @ApiBody({ type: CreateTalentDto })
  @ApiResponse({
    status: 201,
    description: 'Talent created successfully',
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  async create(@Body() createTalentDto: CreateTalentDto, @Request() req: any): Promise<TalentResponseDto> {
    const talent = await this.talentService.create(createTalentDto, req.user?.id);
    return this.mapToResponseDto(talent);
  }

  @Get()
  @ApiOperation({ summary: 'Get talents with filters' })
  @ApiQuery({ type: TalentIndexQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Talents retrieved successfully',
    type: TalentListResponseDto,
  })
  async findAll(@Query() query: TalentIndexQueryDto): Promise<TalentListResponseDto> {
    const result = await this.talentService.getTalents(query);
    return {
      talents: result.talents.map(talent => this.mapToResponseDto(talent)),
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get talent by ID' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Talent found successfully',
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Talent not found',
  })
  async findById(@Param('id') id: string, @Request() req: any): Promise<TalentResponseDto> {
    const talent = await this.talentService.findById(id);
    return this.mapToResponseDto(talent);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update talent by ID' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateTalentDto })
  @ApiResponse({
    status: 200,
    description: 'Talent updated successfully',
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Talent not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTalentDto: UpdateTalentDto,
    @Request() req: any,
  ): Promise<TalentResponseDto> {
    const talent = await this.talentService.update(id, updateTalentDto, req.user?.id);
    return this.mapToResponseDto(talent);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete talent by ID' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Talent deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Talent not found',
  })
  async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
    return this.talentService.delete(id, req.user?.id);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get my talent profile' })
  @ApiResponse({
    status: 200,
    description: 'Talent profile retrieved successfully',
    type: TalentResponseDto,
  })
  async getMyProfile(@Request() req: any): Promise<TalentResponseDto> {
    const talent = await this.talentService.getMyProfile(req.user?.id);
    return this.mapToResponseDto(talent);
  }

  @Get(':id/profile-completion')
  @ApiOperation({ summary: 'Get talent profile completion status' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile completion status retrieved successfully',
  })
  async getProfileCompletion(@Param('id') id: string, @Request() req: any): Promise<any> {
    return this.talentService.getProfileCompletion(id, req.user?.id);
  }

  @Post(':id/experiences')
  @ApiOperation({ summary: 'Add experience to talent profile' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateExperienceDto })
  @ApiResponse({
    status: 200,
    description: 'Experience added successfully',
  })
  async addExperience(
    @Param('id') id: string,
    @Body() createExperienceDto: CreateExperienceDto,
    @Request() req: any,
  ): Promise<any> {
    return this.talentService.addExperience(id, createExperienceDto, req.user?.id);
  }

  @Post(':id/educations')
  @ApiOperation({ summary: 'Add education to talent profile' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateEducationDto })
  @ApiResponse({
    status: 200,
    description: 'Education added successfully',
  })
  async addEducation(
    @Param('id') id: string,
    @Body() createEducationDto: CreateEducationDto,
    @Request() req: any,
  ): Promise<any> {
    return this.talentService.addEducation(id, createEducationDto, req.user?.id);
  }

  @Post(':id/external-links')
  @ApiOperation({ summary: 'Add external link to talent profile' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateExternalLinkDto })
  @ApiResponse({
    status: 200,
    description: 'External link added successfully',
  })
  async addExternalLink(
    @Param('id') id: string,
    @Body() createExternalLinkDto: CreateExternalLinkDto,
    @Request() req: any,
  ): Promise<any> {
    return this.talentService.addExternalLink(id, createExternalLinkDto, req.user?.id);
  }

  @Get(':id/similar-talents')
  @ApiOperation({ summary: 'Get similar talents' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Similar talents retrieved successfully',
  })
  async getSimilarTalents(@Param('id') id: string): Promise<any> {
    const talents = await this.talentService.getSimilarTalents(id);
    return {
      talents: talents.map(talent => this.mapToResponseDto(talent)),
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: talents.length,
        per_page: talents.length
      }
    };
  }

  private mapToResponseDto(talent: Talent): TalentResponseDto {
    return {
      id: talent.id,
      userId: talent.userId,
      about: talent.about,
      employmentStatus: talent.employmentStatus,
      englishProficiency: talent.englishProficiency,
      experienceLevel: talent.experienceLevel,
      managementLevel: talent.managementLevel,
      status: talent.status,
      step: talent.step,
      headline: talent.headline,
      createdAt: talent.createdAt,
      updatedAt: talent.updatedAt,
      deletedAt: talent.deletedAt,
    };
  }
} 