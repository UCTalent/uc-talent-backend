import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SkillService } from '@skill/services/skill.service';
import { Skill } from '@skill/entities/skill.entity';
import {
  SkillResponseDto,
  SkillListResponseDto,
} from '@skill/dtos/skill-response.dto';
import { ResponseHandler } from '@shared/utils/response-handler';
import { Docs } from '@documents/skill/skill.document';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiOperation(Docs.getSkills.operation)
  @ApiResponse(Docs.getSkills.responses.success[0])
  async findAll() {
    const skills = await this.skillService.findAll();
    return ResponseHandler.success({
      data: {
        skills: skills.map(skill => this.mapToResponseDto(skill)),
        total: skills.length,
        page: 1,
        limit: skills.length,
      },
      message: 'Skills retrieved successfully',
    });
  }

  @Get(':id')
  @ApiOperation(Docs.getSkillById.operation)
  @ApiParam(Docs.getSkillById.param)
  @ApiResponse(Docs.getSkillById.responses.success[0])
  @ApiResponse(Docs.getSkillById.responses.error[0])
  async findById(@Param('id') id: string) {
    const skill = await this.skillService.findById(id);
    if (!skill) {
      return ResponseHandler.error({
        statusCode: 404,
        message: 'Skill not found',
      });
    }
    return ResponseHandler.success({
      data: this.mapToResponseDto(skill),
      message: 'Skill found successfully',
    });
  }

  @Get('role/:roleId')
  @ApiOperation(Docs.getSkillsByRole.operation)
  @ApiParam(Docs.getSkillsByRole.param)
  @ApiResponse(Docs.getSkillsByRole.responses.success[0])
  async findByRoleId(@Param('roleId') roleId: string) {
    const skills = await this.skillService.findByRoleId(roleId);
    return ResponseHandler.success({
      data: {
        skills: skills.map(skill => this.mapToResponseDto(skill)),
        total: skills.length,
        page: 1,
        limit: skills.length,
      },
      message: 'Skills found successfully',
    });
  }

  private mapToResponseDto(skill: Skill): SkillResponseDto {
    return {
      id: skill.id,
      name: skill.name,
      roleId: skill.roleId,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      deletedAt: skill.deletedAt,
    };
  }
}
