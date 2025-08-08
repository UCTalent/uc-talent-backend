import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '@skill/entities/skill.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class SkillRepository implements IBaseRepository<Skill> {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  async findById(id: string): Promise<Skill | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findAll(): Promise<Skill[]> {
    return this.repository.find({
      relations: ['role'],
    });
  }

  async create(data: Partial<Skill>): Promise<Skill> {
    const skill = this.repository.create(data);
    return this.repository.save(skill);
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
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

  async findByRoleId(roleId: string): Promise<Skill[]> {
    return this.repository.find({
      where: { roleId },
      relations: ['role'],
    });
  }
}
