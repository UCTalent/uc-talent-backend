import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Docs } from '@documents/user/user.document';
import { Public } from '@shared/cross-cutting/authorization/decorators/public.decorator';
import { ResponseHandler } from '@shared/utils/response-handler';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import type { UserResponseDto } from '@user/dtos/user-response.dto';
import { UserListResponseDto } from '@user/dtos/user-response.dto';
import type { User } from '@user/entities/user.entity';
import { UserService } from '@user/services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(Docs.createUser.operation)
  @ApiBody(Docs.createUser.body)
  @ApiResponse(Docs.createUser.responses.success[0])
  @ApiResponse(Docs.createUser.responses.error![0])
  @ApiResponse(Docs.createUser.responses.error![1])
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
  @ApiOperation(Docs.getUsers.operation)
  @ApiResponse(Docs.getUsers.responses.success[0])
  async findAll() {
    const users = await this.userService.findAll();
    return ResponseHandler.success({
      data: {
        users: users.map((user) => this.mapToResponseDto(user)),
        total: users.length,
        page: 1,
        limit: users.length,
      },
      message: 'Users retrieved successfully',
    });
  }

  @Get(':id')
  @ApiOperation(Docs.getUserById.operation)
  @ApiParam(Docs.getUserById.param)
  @ApiResponse(Docs.getUserById.responses.success[0])
  @ApiResponse(Docs.getUserById.responses.error[0])
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return ResponseHandler.success({
      data: this.mapToResponseDto(user),
      message: 'User found successfully',
    });
  }

  @Put(':id')
  @ApiOperation(Docs.updateUser.operation)
  @ApiParam(Docs.updateUser.param)
  @ApiBody(Docs.updateUser.body)
  @ApiResponse(Docs.updateUser.responses.success[0])
  @ApiResponse(Docs.updateUser.responses.error[0])
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return ResponseHandler.success({
      data: this.mapToResponseDto(user),
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation(Docs.deleteUser.operation)
  @ApiParam(Docs.deleteUser.param)
  @ApiResponse(Docs.deleteUser.responses.success[0])
  @ApiResponse(Docs.deleteUser.responses.error[0])
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return ResponseHandler.success({
      data: null,
      message: 'User deleted successfully',
    });
  }

  @Patch(':id/soft-delete')
  @ApiOperation(Docs.softDeleteUser.operation)
  @ApiParam(Docs.softDeleteUser.param)
  @ApiResponse(Docs.softDeleteUser.responses.success[0])
  @ApiResponse(Docs.softDeleteUser.responses.error[0])
  async softDelete(@Param('id') id: string) {
    await this.userService.softDelete(id);
    return ResponseHandler.success({
      data: null,
      message: 'User soft deleted successfully',
    });
  }

  @Patch(':id/restore')
  @ApiOperation(Docs.restoreUser.operation)
  @ApiParam(Docs.restoreUser.param)
  @ApiResponse(Docs.restoreUser.responses.success[0])
  @ApiResponse(Docs.restoreUser.responses.error[0])
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
