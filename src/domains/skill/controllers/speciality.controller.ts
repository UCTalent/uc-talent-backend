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

import { Docs } from '@documents/skill/speciality.document';
import type {
  SpecialityListResponseDto,
  SpecialityResponseDto,
} from '@skill/dtos/skill-response.dto';
import type { Speciality } from '@skill/entities/speciality.entity';
import { SpecialityService } from '@skill/services/speciality.service';

@ApiTags('specialities')
@Controller('specialities')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Get()
  @ApiOperation(Docs.getSpecialities.operation)
  @ApiResponse(Docs.getSpecialities.responses.success[0])
  async findAll(): Promise<SpecialityListResponseDto> {
    const specialities = await this.specialityService.findAll();
    return {
      specialities: specialities.map((speciality) =>
        this.mapToResponseDto(speciality)
      ),
      total: specialities.length,
      page: 1,
      limit: specialities.length,
    };
  }

  @Get(':id')
  @ApiOperation(Docs.getSpecialityById.operation)
  @ApiParam(Docs.getSpecialityById.param)
  @ApiResponse(Docs.getSpecialityById.responses.success[0])
  @ApiResponse(Docs.getSpecialityById.responses.error[0])
  async findById(
    @Param('id') id: string
  ): Promise<SpecialityResponseDto | null> {
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
