import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'City name',
    example: 'Ho Chi Minh City',
  })
  name: string;

  @ApiProperty({
    description: 'City code',
    example: 'HCMC',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'City country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  countryId: string;

  @ApiProperty({
    description: 'City region ID',
    required: false,
  })
  regionId?: string;

  @ApiProperty({
    description: 'City status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'City created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'City updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'City deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class CountryResponseDto {
  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Vietnam',
  })
  name: string;

  @ApiProperty({
    description: 'Country code',
    example: 'VN',
  })
  code: string;

  @ApiProperty({
    description: 'Country phone code',
    example: '+84',
    required: false,
  })
  phoneCode?: string;

  @ApiProperty({
    description: 'Country status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Country created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Country updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Country deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class RegionResponseDto {
  @ApiProperty({
    description: 'Region ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Region name',
    example: 'Southeast Asia',
  })
  name: string;

  @ApiProperty({
    description: 'Region code',
    example: 'SEA',
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Region status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Region created at',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Region updated at',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Region deleted at',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  deletedAt?: Date;
}

export class CityListResponseDto {
  @ApiProperty({
    description: 'List of cities',
    type: [CityResponseDto],
  })
  cities: CityResponseDto[];

  @ApiProperty({
    description: 'Total count',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;
}

export class CountryListResponseDto {
  @ApiProperty({
    description: 'List of countries',
    type: [CountryResponseDto],
  })
  countries: CountryResponseDto[];

  @ApiProperty({
    description: 'Total count',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;
}

export class RegionListResponseDto {
  @ApiProperty({
    description: 'List of regions',
    type: [RegionResponseDto],
  })
  regions: RegionResponseDto[];

  @ApiProperty({
    description: 'Total count',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;
} 