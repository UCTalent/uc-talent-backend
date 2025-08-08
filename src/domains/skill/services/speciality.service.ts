import { Injectable } from '@nestjs/common';
import { Speciality } from '@skill/entities/speciality.entity';
import { SpecialityRepository } from '@skill/repositories/speciality.repository';

@Injectable()
export class SpecialityService {
  constructor(private readonly specialityRepository: SpecialityRepository) {}

  async findAll(): Promise<Speciality[]> {
    return this.specialityRepository.findAll();
  }

  async findById(id: string): Promise<Speciality | null> {
    return this.specialityRepository.findById(id);
  }
}
