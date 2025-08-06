import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { Region } from './entities/region.entity';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { CityRepository } from './repositories/city.repository';
import { CountryRepository } from './repositories/country.repository';
import { RegionRepository } from './repositories/region.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City, Country, Region])],
  providers: [
    LocationService,
    CityRepository,
    CountryRepository,
    RegionRepository,
  ],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {} 