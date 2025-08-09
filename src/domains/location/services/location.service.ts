import { Injectable } from '@nestjs/common';

import type { City } from '@location/entities/city.entity';
import type { Country } from '@location/entities/country.entity';
import type { Region } from '@location/entities/region.entity';
import { CityRepository } from '@location/repositories/city.repository';
import { CountryRepository } from '@location/repositories/country.repository';
import { RegionRepository } from '@location/repositories/region.repository';

@Injectable()
export class LocationService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly countryRepository: CountryRepository,
    private readonly regionRepository: RegionRepository
  ) {}

  async findAllCities(): Promise<City[]> {
    return this.cityRepository.findAll();
  }

  async findCitiesByCountry(countryId: string): Promise<City[]> {
    return this.cityRepository.findByCountryId(countryId);
  }

  async findAllCountries(): Promise<Country[]> {
    return this.countryRepository.findAll();
  }

  async findAllRegions(): Promise<Region[]> {
    return this.regionRepository.findAll();
  }

  async findCityById(id: string): Promise<City | null> {
    return this.cityRepository.findById(id);
  }

  async findCountryById(id: string): Promise<Country | null> {
    return this.countryRepository.findById(id);
  }

  async findRegionById(id: string): Promise<Region | null> {
    return this.regionRepository.findById(id);
  }
}
