import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SpecialityService } from '@skill/services/speciality.service';
import { Speciality } from '@skill/entities/speciality.entity';
import { SpecialityResponseDto, SpecialityListResponseDto } from '@skill/dtos/skill-response.dto';

@ApiTags('specialities')
@Controller('specialities')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all specialities' })
  @ApiResponse({
    status: 200,
    description: 'Specialities retrieved successfully',
    type: SpecialityListResponseDto,
  })
  async findAll(): Promise<SpecialityListResponseDto> {
    const specialities = await this.specialityService.findAll();
    return {
      specialities: specialities.map(speciality => this.mapToResponseDto(speciality)),
      total: specialities.length,
      page: 1,
      limit: specialities.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get speciality by ID' })
  @ApiParam({
    name: 'id',
    description: 'Speciality ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Speciality found successfully',
    type: SpecialityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Speciality not found',
  })
  async findById(@Param('id') id: string): Promise<SpecialityResponseDto | null> {
    const speciality = await this.specialityService.findById(id);
    return speciality ? this.mapToResponseDto(speciality) : null;
  }

  private mapToResponseDto(speciality: Speciality): SpecialityResponseDto {
    return {
      id: speciality.id,
      name: speciality.name,
      description: speciality.description,
      createdAt: speciality.createdAt,
      updatedAt: speciality.updatedAt,
      deletedAt: speciality.deletedAt,
    };
  }
} 