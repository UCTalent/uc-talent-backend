import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  RegionListResponseDto
} from '@location/dtos/location-response.dto';

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
  async findAllCities(): Promise<CityListResponseDto> {
    const cities = await this.locationService.findAllCities();
    return {
      cities: cities.map(city => this.mapCityToResponseDto(city)),
      total: cities.length,
      page: 1,
      limit: cities.length,
    };
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
  async findCitiesByCountry(@Param('countryId') countryId: string): Promise<CityListResponseDto> {
    const cities = await this.locationService.findCitiesByCountry(countryId);
    return {
      cities: cities.map(city => this.mapCityToResponseDto(city)),
      total: cities.length,
      page: 1,
      limit: cities.length,
    };
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
  async findCityById(@Param('id') id: string): Promise<CityResponseDto | null> {
    const city = await this.locationService.findCityById(id);
    return city ? this.mapCityToResponseDto(city) : null;
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Countries retrieved successfully',
    type: CountryListResponseDto,
  })
  async findAllCountries(): Promise<CountryListResponseDto> {
    const countries = await this.locationService.findAllCountries();
    return {
      countries: countries.map(country => this.mapCountryToResponseDto(country)),
      total: countries.length,
      page: 1,
      limit: countries.length,
    };
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
  async findCountryById(@Param('id') id: string): Promise<CountryResponseDto | null> {
    const country = await this.locationService.findCountryById(id);
    return country ? this.mapCountryToResponseDto(country) : null;
  }

  @Get('regions')
  @ApiOperation({ summary: 'Get all regions' })
  @ApiResponse({
    status: 200,
    description: 'Regions retrieved successfully',
    type: RegionListResponseDto,
  })
  async findAllRegions(): Promise<RegionListResponseDto> {
    const regions = await this.locationService.findAllRegions();
    return {
      regions: regions.map(region => this.mapRegionToResponseDto(region)),
      total: regions.length,
      page: 1,
      limit: regions.length,
    };
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
  async findRegionById(@Param('id') id: string): Promise<RegionResponseDto | null> {
    const region = await this.locationService.findRegionById(id);
    return region ? this.mapRegionToResponseDto(region) : null;
  }

  private mapCityToResponseDto(city: City): CityResponseDto {
    return {
      id: city.id,
      name: city.name,
      code: city.nameAscii, // Using nameAscii as code
      countryId: city.countryId,
      regionId: undefined, // City doesn't have regionId
      status: 'active', // Default status since entity doesn't have status
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
      deletedAt: city.deletedAt,
    };
  }

  private mapCountryToResponseDto(country: Country): CountryResponseDto {
    return {
      id: country.id,
      name: country.name,
      code: country.code,
      phoneCode: undefined, // Country doesn't have phoneCode
      status: 'active', // Default status since entity doesn't have status
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
      deletedAt: country.deletedAt,
    };
  }

  private mapRegionToResponseDto(region: Region): RegionResponseDto {
    return {
      id: region.id,
      name: region.name,
      code: undefined, // Region doesn't have code
      status: 'active', // Default status since entity doesn't have status
      createdAt: region.createdAt,
      updatedAt: region.updatedAt,
      deletedAt: region.deletedAt,
    };
  }
} 