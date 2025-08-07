import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import { UserRepository } from '@user/repositories/user.repository';
import { Email } from '@user/value-objects/email.value-object';
import { Password } from '@user/value-objects/password.value-object';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Validate email
    const emailValueObject = new Email(email);

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided
    let encryptedPassword: string | undefined;
    if (password) {
      const passwordValueObject = new Password(password);
      encryptedPassword = await passwordValueObject.encrypt();
    }

    return this.userRepo.create({
      ...rest,
      email: emailValueObject.value,
      encryptedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepo.findByFirebaseUid(firebaseUid);
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    return this.userRepo.findByConfirmationToken(token);
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepo.findByResetPasswordToken(token);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Check if email is being updated and if it conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const passwordValueObject = new Password(updateUserDto.password);
      updateUserDto.encryptedPassword = await passwordValueObject.encrypt();
      delete updateUserDto.password;
    }

    return this.userRepo.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepo.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepo.restore(id);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.encryptedPassword) {
      return false;
    }
    const passwordValueObject = new Password(password);
    return passwordValueObject.compare(user.encryptedPassword);
  }

  async updateSignInInfo(userId: string, ip: string): Promise<void> {
    await this.userRepo.updateSignInInfo(userId, ip);
  }

  async incrementFailedAttempts(user: User): Promise<void> {
    await this.userRepo.incrementFailedAttempts(user.id);
  }

  async resetFailedAttempts(user: User): Promise<void> {
    await this.userRepo.resetFailedAttempts(user.id);
  }

  // New methods for authentication
  async updateResetToken(userId: string, resetToken: string): Promise<void> {
    await this.userRepo.updateResetToken(userId, resetToken);
  }

  async resetPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepo.resetPassword(userId, hashedPassword);
  }

  async confirmUser(userId: string): Promise<void> {
    await this.userRepo.confirmUser(userId);
  }

  async hasTalentProfile(userId: string): Promise<boolean> {
    // TODO: Implement check if user has talent profile
    // For now, return false
    return false;
  }
} 