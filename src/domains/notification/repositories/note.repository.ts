import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from '@notification/entities/note.entity';
import type { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class NoteRepository implements IBaseRepository<Note> {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>
  ) {}

  async findById(id: string): Promise<Note | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Note[]> {
    return this.repository.find();
  }

  async create(data: Partial<Note>): Promise<Note> {
    const note = this.repository.create(data);
    return this.repository.save(note);
  }

  async update(id: string, data: Partial<Note>): Promise<Note> {
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

  async findByUserId(userId: string): Promise<Note[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
