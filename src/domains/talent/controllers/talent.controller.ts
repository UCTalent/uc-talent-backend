import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TalentService } from '@talent/services/talent.service';
import { CreateTalentDto } from '@talent/dtos/create-talent.dto';
import { UpdateTalentDto } from '@talent/dtos/update-talent.dto';
import { TalentIndexQueryDto } from '@talent/dtos/talent-index-query.dto';
import { CreateExperienceDto } from '@talent/dtos/create-experience.dto';
import { CreateEducationDto } from '@talent/dtos/create-education.dto';
import { CreateExternalLinkDto } from '@talent/dtos/create-external-link.dto';
import {
  TalentResponseDto,
  TalentListResponseDto,
} from '@talent/dtos/talent-response.dto';
import { Talent } from '@talent/entities/talent.entity';
import { ResponseHandler } from '@shared/utils/response-handler';

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
  async create(@Body() createTalentDto: CreateTalentDto, @Request() req: any) {
    const talent = await this.talentService.create(
      createTalentDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: this.mapToResponseDto(talent),
      statusCode: HttpStatus.CREATED,
      message: 'Talent created successfully',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get talents with filters' })
  @ApiQuery({ type: TalentIndexQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Talents retrieved successfully',
    type: TalentListResponseDto,
  })
  async findAll(@Query() query: TalentIndexQueryDto) {
    const result = await this.talentService.getTalents(query);
    return ResponseHandler.success({
      data: {
        talents: result.talents.map(talent => this.mapToResponseDto(talent)),
        pagination: result.pagination,
      },
      message: 'Talents retrieved successfully',
    });
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
  async findById(@Param('id') id: string) {
    const talent = await this.talentService.findById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(talent),
      message: 'Talent found successfully',
    });
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
  ) {
    const talent = await this.talentService.update(
      id,
      updateTalentDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: this.mapToResponseDto(talent),
      message: 'Talent updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete talent by ID' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Talent deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Talent not found',
  })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.talentService.delete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Talent deleted successfully',
    });
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user talent profile' })
  @ApiResponse({
    status: 200,
    description: 'Talent profile retrieved successfully',
    type: TalentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Talent profile not found',
  })
  async getMyProfile(@Request() req: any) {
    const talent = await this.talentService.findByUserId(req.user?.id);
    if (!talent) {
      return ResponseHandler.error({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Talent profile not found',
      });
    }
    return ResponseHandler.success({
      data: this.mapToResponseDto(talent),
      message: 'Talent profile retrieved successfully',
    });
  }

  @Get(':id/profile-completion')
  @ApiOperation({ summary: 'Get talent profile completion percentage' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile completion retrieved successfully',
  })
  async getProfileCompletion(@Param('id') id: string, @Request() req: any) {
    const completion = await this.talentService.getProfileCompletion(
      id,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: completion,
      message: 'Profile completion retrieved successfully',
    });
  }

  @Post(':id/experiences')
  @ApiOperation({ summary: 'Add experience to talent' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateExperienceDto })
  @ApiResponse({
    status: 201,
    description: 'Experience added successfully',
  })
  async addExperience(
    @Param('id') id: string,
    @Body() createExperienceDto: CreateExperienceDto,
    @Request() req: any,
  ) {
    const experience = await this.talentService.addExperience(
      id,
      createExperienceDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: experience,
      statusCode: HttpStatus.CREATED,
      message: 'Experience added successfully',
    });
  }

  @Post(':id/educations')
  @ApiOperation({ summary: 'Add education to talent' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateEducationDto })
  @ApiResponse({
    status: 201,
    description: 'Education added successfully',
  })
  async addEducation(
    @Param('id') id: string,
    @Body() createEducationDto: CreateEducationDto,
    @Request() req: any,
  ) {
    const education = await this.talentService.addEducation(
      id,
      createEducationDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: education,
      statusCode: HttpStatus.CREATED,
      message: 'Education added successfully',
    });
  }

  @Post(':id/external-links')
  @ApiOperation({ summary: 'Add external link to talent' })
  @ApiParam({
    name: 'id',
    description: 'Talent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateExternalLinkDto })
  @ApiResponse({
    status: 201,
    description: 'External link added successfully',
  })
  async addExternalLink(
    @Param('id') id: string,
    @Body() createExternalLinkDto: CreateExternalLinkDto,
    @Request() req: any,
  ) {
    const externalLink = await this.talentService.addExternalLink(
      id,
      createExternalLinkDto,
      req.user?.id,
    );
    return ResponseHandler.success({
      data: externalLink,
      statusCode: HttpStatus.CREATED,
      message: 'External link added successfully',
    });
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
  async getSimilarTalents(@Param('id') id: string) {
    const talents = await this.talentService.getSimilarTalents(id);
    return ResponseHandler.success({
      data: {
        talents: talents.map(talent => this.mapToResponseDto(talent)),
        total: talents.length,
      },
      message: 'Similar talents retrieved successfully',
    });
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
