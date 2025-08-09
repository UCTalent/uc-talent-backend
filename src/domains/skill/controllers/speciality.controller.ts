import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SpecialityService } from '@skill/services/speciality.service';
import { Speciality } from '@skill/entities/speciality.entity';
import { Docs } from '@documents/skill/speciality.document';
import {
  SpecialityResponseDto,
  SpecialityListResponseDto,
} from '@skill/dtos/skill-response.dto';

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
      specialities: specialities.map(speciality =>
        this.mapToResponseDto(speciality),
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
    @Param('id') id: string,
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
