import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import { UserResponseDto, UserListResponseDto } from '@user/dtos/user-response.dto';
import { User } from '@user/entities/user.entity';
import { Public } from '@shared/cross-cutting/authorization/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.mapToResponseDto(user);
  }

  @Get()
  @Public() // Test endpoint - không cần authentication
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UserListResponseDto,
  })
  async findAll(): Promise<UserListResponseDto> {
    const users = await this.userService.findAll();
    return {
      users: users.map(user => this.mapToResponseDto(user)),
      total: users.length,
      page: 1,
      limit: users.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return this.mapToResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, updateUserDto);
    return this.mapToResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Put(':id/soft-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'User soft deleted successfully',
  })
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.userService.softDelete(id);
  }

  @Put(':id/restore')
  @ApiOperation({ summary: 'Restore soft deleted user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
  })
  async restore(@Param('id') id: string): Promise<void> {
    return this.userService.restore(id);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      phoneNumberCountry: user.phoneNumberCountry,
      firebaseUid: user.firebaseUid,
      firebaseProvider: user.firebaseProvider,
      thirdwebMetadata: user.thirdwebMetadata,
      provider: user.provider,
      uid: user.uid,
      refCode: user.refCode,
      locationCityId: user.locationCityId,
      isClickConfirmedForm: user.isClickConfirmedForm,
      confirmationToken: user.confirmationToken,
      confirmedAt: user.confirmedAt,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordSentAt: user.resetPasswordSentAt,
      signInCount: user.signInCount,
      currentSignInAt: user.currentSignInAt,
      currentSignInIp: user.currentSignInIp,
      lastSignInAt: user.lastSignInAt,
      lastSignInIp: user.lastSignInIp,
      failedAttempts: user.failedAttempts,
      lockedAt: user.lockedAt,
      unlockToken: user.unlockToken,
      rememberCreatedAt: user.rememberCreatedAt,
      unconfirmedEmail: user.unconfirmedEmail,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
} 