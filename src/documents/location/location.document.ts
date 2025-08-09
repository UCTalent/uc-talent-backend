import { Document } from '@documents/interface';
import {
  CityListResponseDto,
  CityResponseDto,
  CountryListResponseDto,
  CountryResponseDto,
  RegionListResponseDto,
  RegionResponseDto,
} from '@location/dtos/location-response.dto';

const getCities: Document = {
  operation: { summary: 'Get all cities' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Cities retrieved successfully',
        type: CityListResponseDto,
      },
    ],
  },
} as const;

const getCitiesByCountry: Document = {
  operation: { summary: 'Get cities by country ID' },
  param: {
    name: 'countryId',
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Cities found successfully',
        type: CityListResponseDto,
      },
    ],
  },
} as const;

const getCityById: Document = {
  operation: { summary: 'Get city by ID' },
  param: {
    name: 'id',
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'City found successfully',
        type: CityResponseDto,
      },
    ],
    error: [{ status: 404, description: 'City not found' }],
  },
} as const;

const getCountries: Document = {
  operation: { summary: 'Get all countries' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Countries retrieved successfully',
        type: CountryListResponseDto,
      },
    ],
  },
} as const;

const getCountryById: Document = {
  operation: { summary: 'Get country by ID' },
  param: {
    name: 'id',
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Country found successfully',
        type: CountryResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Country not found' }],
  },
} as const;

const getRegions: Document = {
  operation: { summary: 'Get all regions' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Regions retrieved successfully',
        type: RegionListResponseDto,
      },
    ],
  },
} as const;

const getRegionById: Document = {
  operation: { summary: 'Get region by ID' },
  param: {
    name: 'id',
    description: 'Region ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Region found successfully',
        type: RegionResponseDto,
      },
    ],
    error: [{ status: 404, description: 'Region not found' }],
  },
} as const;

export const Docs = {
  getCities,
  getCitiesByCountry,
  getCityById,
  getCountries,
  getCountryById,
  getRegions,
  getRegionById,
};
