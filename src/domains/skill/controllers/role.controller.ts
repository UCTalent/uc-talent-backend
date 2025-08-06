import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RoleService } from '@skill/services/role.service';
import { Role } from '@skill/entities/role.entity';
import { RoleResponseDto, RoleListResponseDto } from '@skill/dtos/skill-response.dto';

@ApiTags('roles')
@Controller('api/v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: RoleListResponseDto,
  })
  async findAll(): Promise<RoleListResponseDto> {
    const roles = await this.roleService.findAll();
    return {
      roles: roles.map(role => this.mapToResponseDto(role)),
      total: roles.length,
      page: 1,
      limit: roles.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Role found successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findById(@Param('id') id: string): Promise<RoleResponseDto | null> {
    const role = await this.roleService.findById(id);
    return role ? this.mapToResponseDto(role) : null;
  }

  private mapToResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      deletedAt: role.deletedAt,
    };
  }
} 