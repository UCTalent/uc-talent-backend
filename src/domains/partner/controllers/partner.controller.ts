import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';
import { PartnerService } from '@domains/partner/services/partner.service';
import { CreatePartnerDto } from '@domains/partner/dtos/create-partner.dto';
import { UpdatePartnerDto } from '@domains/partner/dtos/update-partner.dto';
import { CreatePartnerHostDto } from '@domains/partner/dtos/create-partner-host.dto';
import { UpdatePartnerHostDto } from '@domains/partner/dtos/update-partner-host.dto';
import { PartnerQueryDto, PartnerHostQueryDto } from '@domains/partner/dtos/partner-query.dto';
import { CreatePartnerNetworkDto, UpdatePartnerNetworkDto } from '@domains/partner/dtos/partner-network.dto';
import { PartnerResponseDto, PartnerHostResponseDto, PartnerNetworkResponseDto } from '@domains/partner/dtos/partner-response.dto';

@ApiTags('Partners')
@Controller('api/v1/partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Partner Management Endpoints
  @Get()
  @ApiOperation({ summary: 'Get partners list' })
  @ApiResponse({ status: 200, description: 'Partners retrieved successfully', type: [PartnerResponseDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isUcTalent', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async getPartners(@Query() query: PartnerQueryDto) {
    return this.partnerService.getPartners(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner details' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner retrieved successfully', type: PartnerResponseDto })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async getPartnerById(@Param('id') id: string) {
    return this.partnerService.getPartnerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new partner' })
  @ApiResponse({ status: 201, description: 'Partner created successfully', type: PartnerResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.createPartner(createPartnerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update partner' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner updated successfully', type: PartnerResponseDto })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async updatePartner(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete partner' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async deletePartner(@Param('id') id: string) {
    return this.partnerService.deletePartner(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get partner statistics' })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async getPartnerStats(@Param('id') id: string) {
    // Note: This method would need to be implemented in the service
    // return this.partnerService.getPartnerStats(id);
    return { success: true, message: 'Stats endpoint - to be implemented' };
  }
}

@ApiTags('Partner Hosts')
@Controller('api/v1/partner-hosts')
export class PartnerHostController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  @ApiOperation({ summary: 'Get partner hosts list' })
  @ApiResponse({ status: 200, description: 'Partner hosts retrieved successfully', type: [PartnerHostResponseDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({ name: 'host', required: false, type: String })
  @ApiQuery({ name: 'isUcTalent', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['host', 'createdAt', 'updatedAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async getPartnerHosts(@Query() query: PartnerHostQueryDto) {
    return this.partnerService.getPartnerHosts(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner host details' })
  @ApiParam({ name: 'id', description: 'Partner Host ID' })
  @ApiResponse({ status: 200, description: 'Partner host retrieved successfully', type: PartnerHostResponseDto })
  @ApiResponse({ status: 404, description: 'Partner host not found' })
  async getPartnerHostById(@Param('id') id: string) {
    return this.partnerService.getPartnerHostById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new partner host' })
  @ApiResponse({ status: 201, description: 'Partner host created successfully', type: PartnerHostResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createPartnerHost(@Body() createPartnerHostDto: CreatePartnerHostDto) {
    return this.partnerService.createPartnerHost(createPartnerHostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update partner host' })
  @ApiParam({ name: 'id', description: 'Partner Host ID' })
  @ApiResponse({ status: 200, description: 'Partner host updated successfully', type: PartnerHostResponseDto })
  @ApiResponse({ status: 404, description: 'Partner host not found' })
  async updatePartnerHost(@Param('id') id: string, @Body() updatePartnerHostDto: UpdatePartnerHostDto) {
    // Note: This method would need to be implemented in the service
    // return this.partnerService.updatePartnerHost(id, updatePartnerHostDto);
    return { success: true, message: 'Update partner host endpoint - to be implemented' };
  }

  @Post(':id/regenerate-token')
  @ApiOperation({ summary: 'Regenerate access token for partner host' })
  @ApiParam({ name: 'id', description: 'Partner Host ID' })
  @ApiResponse({ status: 200, description: 'Access token regenerated successfully' })
  @ApiResponse({ status: 404, description: 'Partner host not found' })
  @HttpCode(HttpStatus.OK)
  async regenerateAccessToken(@Param('id') id: string) {
    return this.partnerService.regenerateAccessToken(id);
  }

  @Get(':hostId/networks')
  @ApiOperation({ summary: 'Get partner host networks' })
  @ApiParam({ name: 'hostId', description: 'Partner Host ID' })
  @ApiResponse({ status: 200, description: 'Networks retrieved successfully', type: [PartnerNetworkResponseDto] })
  async getPartnerNetworks(@Param('hostId') hostId: string) {
    return this.partnerService.getPartnerNetworks(hostId);
  }

  @Post(':hostId/networks')
  @ApiOperation({ summary: 'Add network to partner host' })
  @ApiParam({ name: 'hostId', description: 'Partner Host ID' })
  @ApiResponse({ status: 201, description: 'Network added successfully', type: PartnerNetworkResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addNetworkToPartnerHost(
    @Param('hostId') hostId: string,
    @Body() createNetworkDto: CreatePartnerNetworkDto,
  ) {
    return this.partnerService.addNetworkToPartnerHost(hostId, createNetworkDto);
  }

  @Patch(':hostId/networks/:networkId')
  @ApiOperation({ summary: 'Update partner host network' })
  @ApiParam({ name: 'hostId', description: 'Partner Host ID' })
  @ApiParam({ name: 'networkId', description: 'Network ID' })
  @ApiResponse({ status: 200, description: 'Network updated successfully', type: PartnerNetworkResponseDto })
  @ApiResponse({ status: 404, description: 'Network not found' })
  async updatePartnerNetwork(
    @Param('hostId') hostId: string,
    @Param('networkId') networkId: string,
    @Body() updateNetworkDto: UpdatePartnerNetworkDto,
  ) {
    return this.partnerService.updatePartnerNetwork(hostId, networkId, updateNetworkDto);
  }
}

@ApiTags('Partner Authentication')
@Controller('api/v1/partner-auth')
export class PartnerAuthController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate partner token' })
  @ApiHeader({ name: 'X-Partner-Token', description: 'Partner access token', required: true })
  @ApiHeader({ name: 'X-Partner-Host', description: 'Partner host domain', required: true })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @HttpCode(HttpStatus.OK)
  async validatePartnerToken(
    @Headers('x-partner-token') token: string,
    @Headers('x-partner-host') host: string,
  ) {
    return this.partnerService.validatePartnerToken(token, host);
  }
}