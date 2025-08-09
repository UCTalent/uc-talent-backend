import { Injectable } from '@nestjs/common';

import type { Skill } from '@skill/entities/skill.entity';
import { SkillRepository } from '@skill/repositories/skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.findAll();
  }

  async findById(id: string): Promise<Skill | null> {
    return this.skillRepository.findById(id);
  }

  async findByRoleId(roleId: string): Promise<Skill[]> {
    return this.skillRepository.findByRoleId(roleId);
  }
}
