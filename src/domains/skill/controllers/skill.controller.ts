import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SkillService } from '@skill/services/skill.service';
import { Skill } from '@skill/entities/skill.entity';
import { SkillResponseDto, SkillListResponseDto } from '@skill/dtos/skill-response.dto';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully',
    type: SkillListResponseDto,
  })
  async findAll(): Promise<SkillListResponseDto> {
    const skills = await this.skillService.findAll();
    return {
      skills: skills.map(skill => this.mapToResponseDto(skill)),
      total: skills.length,
      page: 1,
      limit: skills.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiParam({
    name: 'id',
    description: 'Skill ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill found successfully',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  async findById(@Param('id') id: string): Promise<SkillResponseDto | null> {
    const skill = await this.skillService.findById(id);
    return skill ? this.mapToResponseDto(skill) : null;
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'Get skills by role ID' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Skills found successfully',
    type: SkillListResponseDto,
  })
  async findByRoleId(@Param('roleId') roleId: string): Promise<SkillListResponseDto> {
    const skills = await this.skillService.findByRoleId(roleId);
    return {
      skills: skills.map(skill => this.mapToResponseDto(skill)),
      total: skills.length,
      page: 1,
      limit: skills.length,
    };
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