import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SocialAccountService } from '@social/services/social-account.service';
import { SocialAccount } from '@social/entities/social-account.entity';
import { 
  SocialAccountResponseDto, 
  SocialAccountListResponseDto 
} from '@social/dtos/social-response.dto';

@ApiTags('social-accounts')
@Controller('api/v1/social-accounts')
export class SocialAccountController {
  constructor(private readonly socialAccountService: SocialAccountService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get social accounts by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Social accounts found successfully',
    type: SocialAccountListResponseDto,
  })
  async findByUserId(@Param('userId') userId: string): Promise<SocialAccountListResponseDto> {
    const socialAccounts = await this.socialAccountService.findSocialAccountsByUserId(userId);
    return {
      socialAccounts: socialAccounts.map(account => this.mapToResponseDto(account)),
      total: socialAccounts.length,
      page: 1,
      limit: socialAccounts.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get social account by ID' })
  @ApiParam({
    name: 'id',
    description: 'Social account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Social account found successfully',
    type: SocialAccountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found',
  })
  async findById(@Param('id') id: string): Promise<SocialAccountResponseDto> {
    const socialAccount = await this.socialAccountService.findSocialAccountById(id);
    return this.mapToResponseDto(socialAccount);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new social account' })
  @ApiBody({ type: SocialAccount })
  @ApiResponse({
    status: 201,
    description: 'Social account created successfully',
    type: SocialAccountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  async create(@Body() data: Partial<SocialAccount>): Promise<SocialAccountResponseDto> {
    const socialAccount = await this.socialAccountService.createSocialAccount(data);
    return this.mapToResponseDto(socialAccount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete social account by ID' })
  @ApiParam({
    name: 'id',
    description: 'Social account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Social account deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.socialAccountService.deleteSocialAccount(id);
  }

  private mapToResponseDto(socialAccount: SocialAccount): SocialAccountResponseDto {
    return {
      id: socialAccount.id,
      userId: socialAccount.userId,
      provider: socialAccount.provider,
      uid: socialAccount.uid,
      email: socialAccount.email,
      name: socialAccount.name,
      avatar: socialAccount.avatar,
      createdAt: socialAccount.createdAt,
      updatedAt: socialAccount.updatedAt,
      deletedAt: socialAccount.deletedAt,
    };
  }
} 