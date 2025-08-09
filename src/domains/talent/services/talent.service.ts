import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import type { CreateEducationDto } from '@talent/dtos/create-education.dto';
import type { CreateExperienceDto } from '@talent/dtos/create-experience.dto';
import type { CreateExternalLinkDto } from '@talent/dtos/create-external-link.dto';
import type { CreateTalentDto } from '@talent/dtos/create-talent.dto';
import type { TalentIndexQueryDto } from '@talent/dtos/talent-index-query.dto';
import type { UpdateTalentDto } from '@talent/dtos/update-talent.dto';
import type { Talent } from '@talent/entities/talent.entity';
import { TalentStatus } from '@talent/entities/talent.entity';
import { TalentRepository } from '@talent/repositories/talent.repository';

@Injectable()
export class TalentService {
  constructor(private readonly talentRepository: TalentRepository) {}

  async create(
    createTalentDto: CreateTalentDto,
    userId: string
  ): Promise<Talent> {
    const talent = await this.talentRepository.create({
      ...createTalentDto,
      userId,
      status: TalentStatus.NEW_PROFILE,
      step: 0,
    });

    return talent;
  }

  async findAll(): Promise<Talent[]> {
    return this.talentRepository.findAll();
  }

  async findById(id: string): Promise<Talent> {
    const talent = await this.talentRepository.findById(id);
    if (!talent) {
      throw new NotFoundException('Talent not found');
    }
    return talent;
  }

  async findByUserId(userId: string): Promise<Talent | null> {
    return this.talentRepository.findByUserId(userId);
  }

  async update(
    id: string,
    updateTalentDto: UpdateTalentDto,
    userId: string
  ): Promise<Talent> {
    const talent = await this.findById(id);

    // Check if user can update this talent
    if (talent.userId !== userId) {
      throw new UnauthorizedException('Only talent owner can update profile');
    }

    return this.talentRepository.update(id, updateTalentDto);
  }

  async delete(id: string, userId: string): Promise<void> {
    const talent = await this.findById(id);

    if (talent.userId !== userId) {
      throw new UnauthorizedException('Only talent owner can delete profile');
    }

    await this.talentRepository.delete(id);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const talent = await this.findById(id);

    if (talent.userId !== userId) {
      throw new UnauthorizedException('Only talent owner can delete profile');
    }

    await this.talentRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.talentRepository.restore(id);
  }

  async getTalents(
    query: TalentIndexQueryDto
  ): Promise<{ talents: Talent[]; pagination: any }> {
    const { page = 1, ...filters } = query;
    const perPage = 10;

    const [talents, total] =
      await this.talentRepository.findWithFilters(filters);

    return {
      talents,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / perPage),
        total_count: total,
        per_page: perPage,
      },
    };
  }

  async getMyProfile(userId: string): Promise<Talent> {
    const talent = await this.talentRepository.findByUserId(userId);

    if (!talent) {
      throw new NotFoundException('Talent profile not found');
    }

    return talent;
  }

  async getProfileCompletion(
    talentId: string,
    userId: string
  ): Promise<{ step: number; completed: boolean }> {
    const talent = await this.findById(talentId);

    if (talent.userId !== userId) {
      throw new UnauthorizedException(
        'Only talent owner can view profile completion'
      );
    }

    return this.talentRepository.getProfileCompletion(talentId);
  }

  async addExperience(
    talentId: string,
    createExperienceDto: CreateExperienceDto,
    userId: string
  ): Promise<any> {
    const talent = await this.findById(talentId);

    if (talent.userId !== userId) {
      throw new UnauthorizedException('Only talent owner can add experience');
    }

    // TODO: Implement experience creation
    // const experience = await this.experienceRepository.create({
    //   talentId,
    //   ...createExperienceDto
    // });

    return {
      message: 'Experience added successfully',
      // experience
    };
  }

  async addEducation(
    talentId: string,
    createEducationDto: CreateEducationDto,
    userId: string
  ): Promise<any> {
    const talent = await this.findById(talentId);

    if (talent.userId !== userId) {
      throw new UnauthorizedException('Only talent owner can add education');
    }

    // TODO: Implement education creation
    // const education = await this.educationRepository.create({
    //   talentId,
    //   ...createEducationDto
    // });

    return {
      message: 'Education added successfully',
      // education
    };
  }

  async addExternalLink(
    talentId: string,
    createExternalLinkDto: CreateExternalLinkDto,
    userId: string
  ): Promise<any> {
    const talent = await this.findById(talentId);

    if (talent.userId !== userId) {
      throw new UnauthorizedException(
        'Only talent owner can add external link'
      );
    }

    // TODO: Implement external link creation
    // const externalLink = await this.externalLinkRepository.create({
    //   talentId,
    //   ...createExternalLinkDto
    // });

    return {
      message: 'External link added successfully',
      // externalLink
    };
  }

  async getSimilarTalents(
    talentId: string,
    limit: number = 10
  ): Promise<Talent[]> {
    return this.talentRepository.findSimilarTalents(talentId, limit);
  }

  async updateProfileStep(
    talentId: string,
    step: number,
    userId: string
  ): Promise<Talent> {
    const talent = await this.findById(talentId);

    if (talent.userId !== userId) {
      throw new UnauthorizedException(
        'Only talent owner can update profile step'
      );
    }

    return this.talentRepository.update(talentId, { step });
  }
}
