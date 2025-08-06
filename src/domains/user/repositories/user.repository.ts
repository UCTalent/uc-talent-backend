import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { IBaseRepository } from '@shared/infrastructure/database/base.repository.interface';

@Injectable()
export class UserRepository implements IBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
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

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.repository.findOne({ where: { firebaseUid } });
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { confirmationToken: token } });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { resetPasswordToken: token } });
  }

  async updateSignInInfo(id: string, ip: string): Promise<void> {
    await this.repository.update(id, {
      signInCount: () => 'sign_in_count + 1',
      lastSignInAt: () => 'current_sign_in_at',
      lastSignInIp: () => 'current_sign_in_ip',
      currentSignInAt: new Date(),
      currentSignInIp: ip,
    });
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    await this.repository.update(id, {
      failedAttempts: () => 'failed_attempts + 1',
    });
  }

  async resetFailedAttempts(id: string): Promise<void> {
    await this.repository.update(id, {
      failedAttempts: 0,
      lockedAt: null,
      unlockToken: null,
    });
  }

  // New methods for authentication
  async updateResetToken(userId: string, resetToken: string): Promise<void> {
    await this.repository.update(userId, { 
      resetPasswordToken: resetToken,
      resetPasswordSentAt: new Date()
    });
  }

  async resetPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.repository.update(userId, { 
      encryptedPassword: hashedPassword,
      resetPasswordToken: null,
      resetPasswordSentAt: null
    });
  }

  async confirmUser(userId: string): Promise<void> {
    await this.repository.update(userId, { 
      confirmedAt: new Date(),
      confirmationToken: null
    });
  }
} 