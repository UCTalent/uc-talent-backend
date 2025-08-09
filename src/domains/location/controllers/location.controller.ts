import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Docs } from '@documents/location/location.document';
import type {
  CityResponseDto,
  CountryResponseDto,
  RegionResponseDto,
} from '@location/dtos/location-response.dto';
import {
  CityListResponseDto,
  CountryListResponseDto,
  RegionListResponseDto,
} from '@location/dtos/location-response.dto';
import type { City } from '@location/entities/city.entity';
import type { Country } from '@location/entities/country.entity';
import type { Region } from '@location/entities/region.entity';
import { LocationService } from '@location/services/location.service';
import { ResponseHandler } from '@shared/utils/response-handler';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation(Docs.getCities.operation)
  @ApiResponse(Docs.getCities.responses.success[0])
  async findAllCities() {
    const cities = await this.locationService.findAllCities();
    return ResponseHandler.success({
      data: {
        cities: cities.map((city) => this.mapCityToResponseDto(city)),
        total: cities.length,
        page: 1,
        limit: cities.length,
      },
      message: 'Cities retrieved successfully',
    });
  }

  @Get('cities/:countryId')
  @ApiOperation(Docs.getCitiesByCountry.operation)
  @ApiParam(Docs.getCitiesByCountry.param)
  @ApiResponse(Docs.getCitiesByCountry.responses.success[0])
  async findCitiesByCountry(@Param('countryId') countryId: string) {
    const cities = await this.locationService.findCitiesByCountry(countryId);
    return ResponseHandler.success({
      data: {
        cities: cities.map((city) => this.mapCityToResponseDto(city)),
        total: cities.length,
        page: 1,
        limit: cities.length,
      },
      message: 'Cities found successfully',
    });
  }

  @Get('cities/city/:id')
  @ApiOperation(Docs.getCityById.operation)
  @ApiParam(Docs.getCityById.param)
  @ApiResponse(Docs.getCityById.responses.success[0])
  @ApiResponse(Docs.getCityById.responses.error[0])
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
  @ApiOperation(Docs.getCountries.operation)
  @ApiResponse(Docs.getCountries.responses.success[0])
  async findAllCountries() {
    const countries = await this.locationService.findAllCountries();
    return ResponseHandler.success({
      data: {
        countries: countries.map((country) =>
          this.mapCountryToResponseDto(country)
        ),
        total: countries.length,
        page: 1,
        limit: countries.length,
      },
      message: 'Countries retrieved successfully',
    });
  }

  @Get('countries/:id')
  @ApiOperation(Docs.getCountryById.operation)
  @ApiParam(Docs.getCountryById.param)
  @ApiResponse(Docs.getCountryById.responses.success[0])
  @ApiResponse(Docs.getCountryById.responses.error[0])
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
  @ApiOperation(Docs.getRegions.operation)
  @ApiResponse(Docs.getRegions.responses.success[0])
  async findAllRegions() {
    const regions = await this.locationService.findAllRegions();
    return ResponseHandler.success({
      data: {
        regions: regions.map((region) => this.mapRegionToResponseDto(region)),
        total: regions.length,
        page: 1,
        limit: regions.length,
      },
      message: 'Regions retrieved successfully',
    });
  }

  @Get('regions/:id')
  @ApiOperation(Docs.getRegionById.operation)
  @ApiParam(Docs.getRegionById.param)
  @ApiResponse(Docs.getRegionById.responses.success[0])
  @ApiResponse(Docs.getRegionById.responses.error[0])
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
