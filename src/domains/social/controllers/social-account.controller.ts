import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SocialAccountService } from '@domains/social/services/social-account.service';
import { SocialAuthService } from '@domains/social/services/social-auth.service';
import { LinkSocialAccountDto } from '@domains/social/dtos/link-social-account.dto';
import { SocialAuthDto } from '@domains/social/dtos/social-auth.dto';
import { SocialSettingsDto } from '@domains/social/dtos/social-settings.dto';
import { SocialSearchDto } from '@domains/social/dtos/social-search.dto';
import {
  SocialAccountResponseDto,
  SocialSettingsResponseDto,
  SocialProfileResponseDto,
  SyncResultResponseDto,
} from '@domains/social/dtos/social-response.dto';
import { JwtAuthGuard } from '@shared/cross-cutting/authorization';
import { CurrentUser } from '@shared/cross-cutting/authorization';

@ApiTags('Social Accounts')
@Controller('social-accounts')
export class SocialAccountController {
  constructor(
    private readonly socialAccountService: SocialAccountService,
    private readonly socialAuthService: SocialAuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user social accounts' })
  @ApiResponse({
    status: 200,
    description: 'Social accounts retrieved successfully',
    type: [SocialAccountResponseDto],
  })
  async getUserSocialAccounts(@CurrentUser() user: any) {
    return this.socialAccountService.getUserSocialAccounts(user.id);
  }

  @Post('link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Link social account' })
  @ApiResponse({
    status: 201,
    description: 'Social account linked successfully',
    type: SocialAccountResponseDto,
  })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async linkSocialAccount(
    @CurrentUser() user: any,
    @Body() linkDto: LinkSocialAccountDto,
  ) {
    return this.socialAccountService.linkSocialAccount(user.id, linkDto);
  }

  @Delete(':id/unlink')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlink social account' })
  @ApiParam({ name: 'id', description: 'Social account ID' })
  @ApiResponse({ status: 204, description: 'Social account unlinked successfully' })
  @ApiResponse({ status: 404, description: 'Social account not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkSocialAccount(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.unlinkSocialAccount(user.id, id);
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync social account data' })
  @ApiParam({ name: 'id', description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'Social account synced successfully',
  })
  @ApiResponse({ status: 404, description: 'Social account not found' })
  async syncSocialAccount(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.syncSocialAccount(user.id, id);
  }

  @Post('sync-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync all social accounts' })
  @ApiResponse({
    status: 200,
    description: 'All social accounts synced successfully',
    type: [SyncResultResponseDto],
  })
  async syncAllSocialAccounts(@CurrentUser() user: any) {
    return this.socialAccountService.syncAllSocialAccounts(user.id);
  }

  @Post(':id/refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh social account token' })
  @ApiParam({ name: 'id', description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({ status: 404, description: 'Social account not found' })
  async refreshToken(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.refreshSocialToken(user.id, id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by social profile' })
  @ApiQuery({ name: 'provider', required: false, type: String })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'skills', required: false, type: [String] })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'industry', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [SocialProfileResponseDto],
  })
  async searchSocialProfiles(@Query() searchDto: SocialSearchDto) {
    return this.socialAccountService.searchSocialProfiles(searchDto);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get social privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
    type: SocialSettingsResponseDto,
  })
  async getSocialSettings(@CurrentUser() user: any) {
    return this.socialAccountService.getSocialSettings(user.id);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update social privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    type: SocialSettingsResponseDto,
  })
  async updateSocialSettings(
    @CurrentUser() user: any,
    @Body() settingsDto: SocialSettingsDto,
  ) {
    return this.socialAccountService.updateSocialSettings(user.id, settingsDto);
  }

  // Legacy endpoints for backward compatibility
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get social accounts by user ID (legacy)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Social accounts found successfully',
  })
  async findByUserId(@Param('userId') userId: string) {
    const socialAccounts = await this.socialAccountService.findSocialAccountsByUserId(userId);
    return {
      socialAccounts,
      total: socialAccounts.length,
      page: 1,
      limit: socialAccounts.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get social account by ID (legacy)' })
  @ApiParam({ name: 'id', description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'Social account found successfully',
  })
  @ApiResponse({ status: 404, description: 'Social account not found' })
  async findById(@Param('id') id: string) {
    return this.socialAccountService.findSocialAccountById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete social account by ID (legacy)' })
  @ApiParam({ name: 'id', description: 'Social account ID' })
  @ApiResponse({
    status: 204,
    description: 'Social account deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Social account not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.socialAccountService.deleteSocialAccount(id);
  }
}

@ApiTags('Social Authentication')
@Controller('social-auth')
export class SocialAuthController {
  constructor(private readonly socialAuthService: SocialAuthService) {}

  @Post(':provider')
  @ApiOperation({ summary: 'Authenticate with social provider' })
  @ApiParam({
    name: 'provider',
    description: 'Social provider',
    enum: ['facebook', 'x', 'twitter', 'linkedin', 'github', 'instagram', 'discord', 'telegram'],
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
  })
  @ApiResponse({ status: 400, description: 'Authentication failed' })
  async authenticateWithSocial(
    @Param('provider') provider: string,
    @Body() authDto: SocialAuthDto,
  ) {
    return this.socialAuthService.authenticateWithSocial(provider, authDto);
  }
}