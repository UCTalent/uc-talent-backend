import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LocationService } from '@location/services/location.service';
import { City } from '@location/entities/city.entity';
import { Country } from '@location/entities/country.entity';
import { Region } from '@location/entities/region.entity';
import {
  CityResponseDto,
  CountryResponseDto,
  RegionResponseDto,
  CityListResponseDto,
  CountryListResponseDto,
  RegionListResponseDto,
} from '@location/dtos/location-response.dto';
import { ResponseHandler } from '@shared/utils/response-handler';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({
    status: 200,
    description: 'Cities retrieved successfully',
    type: CityListResponseDto,
  })
  async findAllCities() {
    const cities = await this.locationService.findAllCities();
    return ResponseHandler.success({
      data: {
        cities: cities.map(city => this.mapCityToResponseDto(city)),
        total: cities.length,
        page: 1,
        limit: cities.length,
      },
      message: 'Cities retrieved successfully',
    });
  }

  @Get('cities/:countryId')
  @ApiOperation({ summary: 'Get cities by country ID' })
  @ApiParam({
    name: 'countryId',
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cities found successfully',
    type: CityListResponseDto,
  })
  async findCitiesByCountry(@Param('countryId') countryId: string) {
    const cities = await this.locationService.findCitiesByCountry(countryId);
    return ResponseHandler.success({
      data: {
        cities: cities.map(city => this.mapCityToResponseDto(city)),
        total: cities.length,
        page: 1,
        limit: cities.length,
      },
      message: 'Cities found successfully',
    });
  }

  @Get('cities/city/:id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiParam({
    name: 'id',
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'City found successfully',
    type: CityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  async findCityById(@Param('id') id: string) {
    const city = await this.locationService.findCityById(id);
    if (!city) {
      return ResponseHandler.error({
        statusCode: 404,
        message: 'City not found',
      });
    }
    return ResponseHandler.success({
      data: this.mapCityToResponseDto(city),
      message: 'City found successfully',
    });
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Countries retrieved successfully',
    type: CountryListResponseDto,
  })
  async findAllCountries() {
    const countries = await this.locationService.findAllCountries();
    return ResponseHandler.success({
      data: {
        countries: countries.map(country =>
          this.mapCountryToResponseDto(country),
        ),
        total: countries.length,
        page: 1,
        limit: countries.length,
      },
      message: 'Countries retrieved successfully',
    });
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({
    name: 'id',
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Country found successfully',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
  })
  async findCountryById(@Param('id') id: string) {
    const country = await this.locationService.findCountryById(id);
    if (!country) {
      return ResponseHandler.error({
        statusCode: 404,
        message: 'Country not found',
      });
    }
    return ResponseHandler.success({
      data: this.mapCountryToResponseDto(country),
      message: 'Country found successfully',
    });
  }

  @Get('regions')
  @ApiOperation({ summary: 'Get all regions' })
  @ApiResponse({
    status: 200,
    description: 'Regions retrieved successfully',
    type: RegionListResponseDto,
  })
  async findAllRegions() {
    const regions = await this.locationService.findAllRegions();
    return ResponseHandler.success({
      data: {
        regions: regions.map(region => this.mapRegionToResponseDto(region)),
        total: regions.length,
        page: 1,
        limit: regions.length,
      },
      message: 'Regions retrieved successfully',
    });
  }

  @Get('regions/:id')
  @ApiOperation({ summary: 'Get region by ID' })
  @ApiParam({
    name: 'id',
    description: 'Region ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Region found successfully',
    type: RegionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Region not found',
  })
  async findRegionById(@Param('id') id: string) {
    const region = await this.locationService.findRegionById(id);
    if (!region) {
      return ResponseHandler.error({
        statusCode: 404,
        message: 'Region not found',
      });
    }
    return ResponseHandler.success({
      data: this.mapRegionToResponseDto(region),
      message: 'Region found successfully',
    });
  }

  private mapCityToResponseDto(city: City): CityResponseDto {
    return {
      id: city.id,
      name: city.name,
      countryId: city.countryId,
      status: 'active', // Default status since entity doesn't have status
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    };
  }

  private mapCountryToResponseDto(country: Country): CountryResponseDto {
    return {
      id: country.id,
      name: country.name,
      code: country.code,
      status: 'active', // Default status since entity doesn't have status
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    };
  }

  private mapRegionToResponseDto(region: Region): RegionResponseDto {
    return {
      id: region.id,
      name: region.name,
      status: 'active', // Default status since entity doesn't have status
      createdAt: region.createdAt,
      updatedAt: region.updatedAt,
    };
  }
}
