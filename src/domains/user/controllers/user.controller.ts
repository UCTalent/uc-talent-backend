import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import {
  UserResponseDto,
  UserListResponseDto,
} from '@user/dtos/user-response.dto';
import { User } from '@user/entities/user.entity';
import { Public } from '@shared/cross-cutting/authorization/decorators/public.decorator';
import { ResponseHandler } from '@shared/utils/response-handler';

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
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return ResponseHandler.success({
      data: this.mapToResponseDto(user),
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    });
  }

  @Get()
  @Public() // Test endpoint - không cần authentication
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UserListResponseDto,
  })
  async findAll() {
    const users = await this.userService.findAll();
    return ResponseHandler.success({
      data: {
        users: users.map(user => this.mapToResponseDto(user)),
        total: users.length,
        page: 1,
        limit: users.length,
      },
      message: 'Users retrieved successfully',
    });
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
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(user),
      message: 'User found successfully',
    });
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return ResponseHandler.success({
      data: this.mapToResponseDto(user),
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return ResponseHandler.success({
      data: null,
      message: 'User deleted successfully',
    });
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async softDelete(@Param('id') id: string) {
    await this.userService.softDelete(id);
    return ResponseHandler.success({
      data: null,
      message: 'User soft deleted successfully',
    });
  }

  @Patch(':id/restore')
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
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async restore(@Param('id') id: string) {
    await this.userService.restore(id);
    return ResponseHandler.success({
      data: null,
      message: 'User restored successfully',
    });
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
