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
import { Docs } from '@documents/talent/talent.document';

@ApiTags('talents')
@Controller('talents')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(Docs.createTalent.operation)
  @ApiBody(Docs.createTalent.body)
  @ApiResponse(Docs.createTalent.responses.success[0])
  @ApiResponse(Docs.createTalent.responses.error[0])
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
  @ApiOperation(Docs.getTalents.operation)
  @ApiQuery(Docs.getTalents.query as any)
  @ApiResponse(Docs.getTalents.responses.success[0])
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
  @ApiOperation(Docs.getTalentById.operation)
  @ApiParam(Docs.getTalentById.param)
  @ApiResponse(Docs.getTalentById.responses.success[0])
  @ApiResponse(Docs.getTalentById.responses.error[0])
  async findById(@Param('id') id: string) {
    const talent = await this.talentService.findById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(talent),
      message: 'Talent found successfully',
    });
  }

  @Put(':id')
  @ApiOperation(Docs.updateTalent.operation)
  @ApiParam(Docs.updateTalent.param)
  @ApiBody(Docs.updateTalent.body)
  @ApiResponse(Docs.updateTalent.responses.success[0])
  @ApiResponse(Docs.updateTalent.responses.error[0])
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
  @ApiOperation(Docs.deleteTalent.operation)
  @ApiParam(Docs.deleteTalent.param)
  @ApiResponse(Docs.deleteTalent.responses.success[0])
  @ApiResponse(Docs.deleteTalent.responses.error[0])
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.talentService.delete(id, req.user?.id);
    return ResponseHandler.success({
      data: null,
      message: 'Talent deleted successfully',
    });
  }

  @Get('profile/me')
  @ApiOperation(Docs.getMyProfile.operation)
  @ApiResponse(Docs.getMyProfile.responses.success[0])
  @ApiResponse(Docs.getMyProfile.responses.error[0])
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
  @ApiOperation(Docs.getProfileCompletion.operation)
  @ApiParam(Docs.getProfileCompletion.param)
  @ApiResponse(Docs.getProfileCompletion.responses.success[0])
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
  @ApiOperation(Docs.addExperience.operation)
  @ApiParam(Docs.addExperience.param)
  @ApiBody(Docs.addExperience.body)
  @ApiResponse(Docs.addExperience.responses.success[0])
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
  @ApiOperation(Docs.addEducation.operation)
  @ApiParam(Docs.addEducation.param)
  @ApiBody(Docs.addEducation.body)
  @ApiResponse(Docs.addEducation.responses.success[0])
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
  @ApiOperation(Docs.addExternalLink.operation)
  @ApiParam(Docs.addExternalLink.param)
  @ApiBody(Docs.addExternalLink.body)
  @ApiResponse(Docs.addExternalLink.responses.success[0])
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
  @ApiOperation(Docs.getSimilarTalents.operation)
  @ApiParam(Docs.getSimilarTalents.param)
  @ApiResponse(Docs.getSimilarTalents.responses.success[0])
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
