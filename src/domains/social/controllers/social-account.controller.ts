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
import { Docs as SocialDocs } from '@documents/social/social.document';

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
  @ApiOperation(SocialDocs.getUserSocialAccounts.operation)
  @ApiResponse(SocialDocs.getUserSocialAccounts.responses.success[0])
  async getUserSocialAccounts(@CurrentUser() user: any) {
    return this.socialAccountService.getUserSocialAccounts(user.id);
  }

  @Post('link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.linkSocialAccount.operation)
  @ApiResponse(SocialDocs.linkSocialAccount.responses.success[0])
  @ApiResponse(SocialDocs.linkSocialAccount.responses.error[0])
  async linkSocialAccount(
    @CurrentUser() user: any,
    @Body() linkDto: LinkSocialAccountDto,
  ) {
    return this.socialAccountService.linkSocialAccount(user.id, linkDto);
  }

  @Delete(':id/unlink')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.unlinkSocialAccount.operation)
  @ApiParam(SocialDocs.unlinkSocialAccount.param)
  @ApiResponse(SocialDocs.unlinkSocialAccount.responses.success[0])
  @ApiResponse(SocialDocs.unlinkSocialAccount.responses.error[0])
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkSocialAccount(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.unlinkSocialAccount(user.id, id);
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.syncSocialAccount.operation)
  @ApiParam(SocialDocs.syncSocialAccount.param)
  @ApiResponse(SocialDocs.syncSocialAccount.responses.success[0])
  @ApiResponse(SocialDocs.syncSocialAccount.responses.error[0])
  async syncSocialAccount(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.syncSocialAccount(user.id, id);
  }

  @Post('sync-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.syncAllSocialAccounts.operation)
  @ApiResponse(SocialDocs.syncAllSocialAccounts.responses.success[0])
  async syncAllSocialAccounts(@CurrentUser() user: any) {
    return this.socialAccountService.syncAllSocialAccounts(user.id);
  }

  @Post(':id/refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.refreshToken.operation)
  @ApiParam(SocialDocs.refreshToken.param)
  @ApiResponse(SocialDocs.refreshToken.responses.success[0])
  @ApiResponse(SocialDocs.refreshToken.responses.error[0])
  async refreshToken(@CurrentUser() user: any, @Param('id') id: string) {
    return this.socialAccountService.refreshSocialToken(user.id, id);
  }

  @Get('search')
  @ApiOperation(SocialDocs.searchSocialProfiles.operation)
  @ApiQuery(SocialDocs.searchSocialProfiles.query as any)
  @ApiResponse(SocialDocs.searchSocialProfiles.responses.success[0])
  async searchSocialProfiles(@Query() searchDto: SocialSearchDto) {
    return this.socialAccountService.searchSocialProfiles(searchDto);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.getSocialSettings.operation)
  @ApiResponse(SocialDocs.getSocialSettings.responses.success[0])
  async getSocialSettings(@CurrentUser() user: any) {
    return this.socialAccountService.getSocialSettings(user.id);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(SocialDocs.updateSocialSettings.operation)
  @ApiResponse(SocialDocs.updateSocialSettings.responses.success[0])
  async updateSocialSettings(
    @CurrentUser() user: any,
    @Body() settingsDto: SocialSettingsDto,
  ) {
    return this.socialAccountService.updateSocialSettings(user.id, settingsDto);
  }

  // Legacy endpoints for backward compatibility
  @Get('user/:userId')
  @ApiOperation(SocialDocs.findByUserIdLegacy.operation)
  @ApiParam(SocialDocs.findByUserIdLegacy.param)
  @ApiResponse(SocialDocs.findByUserIdLegacy.responses.success[0])
  async findByUserId(@Param('userId') userId: string) {
    const socialAccounts =
      await this.socialAccountService.findSocialAccountsByUserId(userId);
    return {
      socialAccounts,
      total: socialAccounts.length,
      page: 1,
      limit: socialAccounts.length,
    };
  }

  @Get(':id')
  @ApiOperation(SocialDocs.findByIdLegacy.operation)
  @ApiParam(SocialDocs.findByIdLegacy.param)
  @ApiResponse(SocialDocs.findByIdLegacy.responses.success[0])
  @ApiResponse(SocialDocs.findByIdLegacy.responses.error[0])
  async findById(@Param('id') id: string) {
    return this.socialAccountService.findSocialAccountById(id);
  }

  @Delete(':id')
  @ApiOperation(SocialDocs.deleteLegacy.operation)
  @ApiParam(SocialDocs.deleteLegacy.param)
  @ApiResponse(SocialDocs.deleteLegacy.responses.success[0])
  @ApiResponse(SocialDocs.deleteLegacy.responses.error[0])
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
  @ApiOperation(SocialDocs.authenticateWithSocial.operation)
  @ApiParam(SocialDocs.authenticateWithSocial.param as any)
  @ApiResponse(SocialDocs.authenticateWithSocial.responses.success[0])
  @ApiResponse(SocialDocs.authenticateWithSocial.responses.error[0])
  async authenticateWithSocial(
    @Param('provider') provider: string,
    @Body() authDto: SocialAuthDto,
  ) {
    return this.socialAuthService.authenticateWithSocial(provider, authDto);
  }
}
