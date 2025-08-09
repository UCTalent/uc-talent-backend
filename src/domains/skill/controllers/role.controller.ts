import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Docs } from '@documents/skill/role.document';
import type {
  RoleListResponseDto,
  RoleResponseDto,
} from '@skill/dtos/skill-response.dto';
import type { Role } from '@skill/entities/role.entity';
import { RoleService } from '@skill/services/role.service';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation(Docs.getRoles.operation)
  @ApiResponse(Docs.getRoles.responses.success[0])
  async findAll(): Promise<RoleListResponseDto> {
    const roles = await this.roleService.findAll();
    return {
      roles: roles.map((role) => this.mapToResponseDto(role)),
      total: roles.length,
      page: 1,
      limit: roles.length,
    };
  }

  @Get(':id')
  @ApiOperation(Docs.getRoleById.operation)
  @ApiParam(Docs.getRoleById.param)
  @ApiResponse(Docs.getRoleById.responses.success[0])
  @ApiResponse(Docs.getRoleById.responses.error[0])
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
