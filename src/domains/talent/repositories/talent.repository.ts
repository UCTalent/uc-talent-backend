import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Talent,
  TalentStatus,
  EmploymentStatus,
  EnglishProficiency,
} from '@talent/entities/talent.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class TalentRepository implements IBaseRepository<Talent> {
  constructor(
    @InjectRepository(Talent)
    private readonly repository: Repository<Talent>,
  ) {}

  async findById(id: string): Promise<Talent | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Talent[]> {
    return this.repository.find();
  }

  async create(data: Partial<Talent>): Promise<Talent> {
    const talent = this.repository.create(data);
    return this.repository.save(talent);
  }

  async update(id: string, data: Partial<Talent>): Promise<Talent> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async findByUserId(userId: string): Promise<Talent | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async findByStatus(status: TalentStatus): Promise<Talent[]> {
    return this.repository.find({
      where: { status },
      relations: ['user', 'specialities', 'skills', 'roles'],
    });
  }

  async findByEmploymentStatus(
    employmentStatus: EmploymentStatus,
  ): Promise<Talent[]> {
    return this.repository.find({
      where: { employmentStatus },
      relations: ['user', 'specialities', 'skills'],
    });
  }

  async findWithFilters(filters: any): Promise<[Talent[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('talent')
      .leftJoinAndSelect('talent.user', 'user')
      .leftJoinAndSelect('talent.specialities', 'specialities')
      .leftJoinAndSelect('talent.skills', 'skills')
      .leftJoinAndSelect('talent.roles', 'roles')
      .leftJoinAndSelect('talent.experiences', 'experiences')
      .leftJoinAndSelect('talent.educations', 'educations');

    // Apply filters
    if (filters.query) {
      queryBuilder.andWhere(
        '(talent.headline ILIKE :query OR talent.about ILIKE :query OR user.name ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.employment_status) {
      queryBuilder.andWhere('talent.employmentStatus = :employmentStatus', {
        employmentStatus: filters.employment_status,
      });
    }

    if (filters.english_proficiency) {
      queryBuilder.andWhere('talent.englishProficiency = :englishProficiency', {
        englishProficiency: filters.english_proficiency,
      });
    }

    if (filters.experience_levels?.length) {
      queryBuilder.andWhere('talent.experienceLevel IN (:...levels)', {
        levels: filters.experience_levels,
      });
    }

    if (filters.management_levels?.length) {
      queryBuilder.andWhere('talent.managementLevel IN (:...levels)', {
        levels: filters.management_levels,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('talent.status = :status', {
        status: filters.status,
      });
    }

    if (filters.speciality_ids?.length) {
      queryBuilder.andWhere('specialities.id IN (:...specialityIds)', {
        specialityIds: filters.speciality_ids,
      });
    }

    if (filters.skill_ids?.length) {
      queryBuilder.andWhere('skills.id IN (:...skillIds)', {
        skillIds: filters.skill_ids,
      });
    }

    if (filters.role_ids?.length) {
      queryBuilder.andWhere('roles.id IN (:...roleIds)', {
        roleIds: filters.role_ids,
      });
    }

    if (filters.ids?.length) {
      queryBuilder.andWhere('talent.id IN (:...ids)', { ids: filters.ids });
    }

    // Only active talents by default
    if (!filters.status) {
      queryBuilder.andWhere('talent.status = :status', {
        status: TalentStatus.ACTIVE,
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findSimilarTalents(
    talentId: string,
    limit: number = 10,
  ): Promise<Talent[]> {
    const talent = await this.repository.findOne({
      where: { id: talentId },
      relations: ['specialities', 'skills'],
    });

    if (!talent) return [];

    return this.repository
      .createQueryBuilder('talent')
      .leftJoinAndSelect('talent.user', 'user')
      .leftJoinAndSelect('talent.specialities', 'specialities')
      .leftJoinAndSelect('talent.skills', 'skills')
      .where('talent.id != :talentId', { talentId })
      .andWhere('talent.status = :status', { status: TalentStatus.ACTIVE })
      .andWhere('talent.experienceLevel = :experienceLevel', {
        experienceLevel: talent.experienceLevel,
      })
      .orderBy('talent.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getProfileCompletion(
    talentId: string,
  ): Promise<{ step: number; completed: boolean }> {
    const talent = await this.repository.findOne({
      where: { id: talentId },
      relations: ['experiences', 'educations', 'skills', 'specialities'],
    });

    if (!talent) {
      return { step: 0, completed: false };
    }

    let step = 0;
    let completed = true;

    // Step 1: Basic info
    if (talent.headline && talent.about) {
      step = 1;
    } else {
      completed = false;
    }

    // Step 2: Experience
    if (talent.experiences?.length > 0) {
      step = 2;
    } else {
      completed = false;
    }

    // Step 3: Education
    if (talent.educations?.length > 0) {
      step = 3;
    } else {
      completed = false;
    }

    // Step 4: Skills
    if (talent.skills?.length > 0) {
      step = 4;
    } else {
      completed = false;
    }

    // Step 5: Specialities
    if (talent.specialities?.length > 0) {
      step = 5;
    } else {
      completed = false;
    }

    return { step, completed };
  }
}
