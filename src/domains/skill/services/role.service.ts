import { Injectable } from '@nestjs/common';
import { Role } from '@skill/entities/role.entity';
import { RoleRepository } from '@skill/repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }
} 