import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Web3Event } from '@payment/entities/web3-event.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class Web3EventRepository implements IBaseRepository<Web3Event> {
  constructor(
    @InjectRepository(Web3Event)
    private readonly repository: Repository<Web3Event>,
  ) {}

  async findById(id: string): Promise<Web3Event | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['job'],
    });
  }

  async findAll(): Promise<Web3Event[]> {
    return this.repository.find({
      relations: ['job'],
    });
  }

  async create(data: Partial<Web3Event>): Promise<Web3Event> {
    const web3Event = this.repository.create(data);
    return this.repository.save(web3Event);
  }

  async update(id: string, data: Partial<Web3Event>): Promise<Web3Event> {
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

  async findByJob(jobId: string): Promise<Web3Event[]> {
    return this.repository.find({
      where: { jobId },
      relations: ['job'],
    });
  }
}
