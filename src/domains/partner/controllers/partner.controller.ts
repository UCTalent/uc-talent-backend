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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { PartnerService } from '@domains/partner/services/partner.service';
import { CreatePartnerDto } from '@domains/partner/dtos/create-partner.dto';
import { UpdatePartnerDto } from '@domains/partner/dtos/update-partner.dto';
import { CreatePartnerHostDto } from '@domains/partner/dtos/create-partner-host.dto';
import { UpdatePartnerHostDto } from '@domains/partner/dtos/update-partner-host.dto';
import {
  PartnerQueryDto,
  PartnerHostQueryDto,
} from '@domains/partner/dtos/partner-query.dto';
import {
  CreatePartnerNetworkDto,
  UpdatePartnerNetworkDto,
} from '@domains/partner/dtos/partner-network.dto';
import {
  PartnerResponseDto,
  PartnerHostResponseDto,
  PartnerNetworkResponseDto,
} from '@domains/partner/dtos/partner-response.dto';
import { Docs as PartnerDocs } from '@documents/partner/partner.document';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Partner Management Endpoints
  @Get()
  @ApiOperation(PartnerDocs.getPartners.operation)
  @ApiQuery(PartnerDocs.getPartners.query as any)
  @ApiResponse(PartnerDocs.getPartners.responses.success[0])
  async getPartners(@Query() query: PartnerQueryDto) {
    return this.partnerService.getPartners(query);
  }

  @Get(':id')
  @ApiOperation(PartnerDocs.getPartnerById.operation)
  @ApiParam(PartnerDocs.getPartnerById.param)
  @ApiResponse(PartnerDocs.getPartnerById.responses.success[0])
  @ApiResponse(PartnerDocs.getPartnerById.responses.error[0])
  async getPartnerById(@Param('id') id: string) {
    return this.partnerService.getPartnerById(id);
  }

  @Post()
  @ApiOperation(PartnerDocs.createPartner.operation)
  @ApiResponse(PartnerDocs.createPartner.responses.success[0])
  @ApiResponse(PartnerDocs.createPartner.responses.error[0])
  async createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.createPartner(createPartnerDto);
  }

  @Put(':id')
  @ApiOperation(PartnerDocs.updatePartner.operation)
  @ApiParam(PartnerDocs.updatePartner.param)
  @ApiResponse(PartnerDocs.updatePartner.responses.success[0])
  @ApiResponse(PartnerDocs.updatePartner.responses.error[0])
  async updatePartner(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiOperation(PartnerDocs.deletePartner.operation)
  @ApiParam(PartnerDocs.deletePartner.param)
  @ApiResponse(PartnerDocs.deletePartner.responses.success[0])
  @ApiResponse(PartnerDocs.deletePartner.responses.error[0])
  async deletePartner(@Param('id') id: string) {
    return this.partnerService.deletePartner(id);
  }

  @Get(':id/stats')
  @ApiOperation(PartnerDocs.getPartnerStats.operation)
  @ApiParam(PartnerDocs.getPartnerStats.param)
  @ApiResponse(PartnerDocs.getPartnerStats.responses.success[0])
  @ApiResponse(PartnerDocs.getPartnerStats.responses.error[0])
  async getPartnerStats(@Param('id') id: string) {
    // Note: This method would need to be implemented in the service
    // return this.partnerService.getPartnerStats(id);
    return { success: true, message: 'Stats endpoint - to be implemented' };
  }
}

@ApiTags('Partner Hosts')
@Controller('partner-hosts')
export class PartnerHostController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  @ApiOperation(PartnerDocs.getPartnerHosts.operation)
  @ApiQuery(PartnerDocs.getPartnerHosts.query as any)
  @ApiResponse(PartnerDocs.getPartnerHosts.responses.success[0])
  async getPartnerHosts(@Query() query: PartnerHostQueryDto) {
    return this.partnerService.getPartnerHosts(query);
  }

  @Get(':id')
  @ApiOperation(PartnerDocs.getPartnerHostById.operation)
  @ApiParam(PartnerDocs.getPartnerHostById.param)
  @ApiResponse(PartnerDocs.getPartnerHostById.responses.success[0])
  @ApiResponse(PartnerDocs.getPartnerHostById.responses.error[0])
  async getPartnerHostById(@Param('id') id: string) {
    return this.partnerService.getPartnerHostById(id);
  }

  @Post()
  @ApiOperation(PartnerDocs.createPartnerHost.operation)
  @ApiResponse(PartnerDocs.createPartnerHost.responses.success[0])
  @ApiResponse(PartnerDocs.createPartnerHost.responses.error[0])
  async createPartnerHost(@Body() createPartnerHostDto: CreatePartnerHostDto) {
    return this.partnerService.createPartnerHost(createPartnerHostDto);
  }

  @Put(':id')
  @ApiOperation(PartnerDocs.updatePartnerHost.operation)
  @ApiParam(PartnerDocs.updatePartnerHost.param)
  @ApiResponse(PartnerDocs.updatePartnerHost.responses.success[0])
  @ApiResponse(PartnerDocs.updatePartnerHost.responses.error[0])
  async updatePartnerHost(
    @Param('id') id: string,
    @Body() updatePartnerHostDto: UpdatePartnerHostDto,
  ) {
    // Note: This method would need to be implemented in the service
    // return this.partnerService.updatePartnerHost(id, updatePartnerHostDto);
    return {
      success: true,
      message: 'Update partner host endpoint - to be implemented',
    };
  }

  @Post(':id/regenerate-token')
  @ApiOperation(PartnerDocs.regenerateHostToken.operation)
  @ApiParam(PartnerDocs.regenerateHostToken.param)
  @ApiResponse(PartnerDocs.regenerateHostToken.responses.success[0])
  @ApiResponse(PartnerDocs.regenerateHostToken.responses.error[0])
  @HttpCode(HttpStatus.OK)
  async regenerateAccessToken(@Param('id') id: string) {
    return this.partnerService.regenerateAccessToken(id);
  }

  @Get(':hostId/networks')
  @ApiOperation(PartnerDocs.getPartnerNetworks.operation)
  @ApiParam(PartnerDocs.getPartnerNetworks.param)
  @ApiResponse(PartnerDocs.getPartnerNetworks.responses.success[0])
  async getPartnerNetworks(@Param('hostId') hostId: string) {
    return this.partnerService.getPartnerNetworks(hostId);
  }

  @Post(':hostId/networks')
  @ApiOperation(PartnerDocs.addNetworkToPartnerHost.operation)
  @ApiParam(PartnerDocs.addNetworkToPartnerHost.param)
  @ApiResponse(PartnerDocs.addNetworkToPartnerHost.responses.success[0])
  @ApiResponse(PartnerDocs.addNetworkToPartnerHost.responses.error[0])
  async addNetworkToPartnerHost(
    @Param('hostId') hostId: string,
    @Body() createNetworkDto: CreatePartnerNetworkDto,
  ) {
    return this.partnerService.addNetworkToPartnerHost(
      hostId,
      createNetworkDto,
    );
  }

  @Patch(':hostId/networks/:networkId')
  @ApiOperation(PartnerDocs.updatePartnerNetwork.operation)
  @ApiParam(PartnerDocs.updatePartnerNetwork.param)
  @ApiResponse(PartnerDocs.updatePartnerNetwork.responses.success[0])
  @ApiResponse(PartnerDocs.updatePartnerNetwork.responses.error[0])
  async updatePartnerNetwork(
    @Param('hostId') hostId: string,
    @Param('networkId') networkId: string,
    @Body() updateNetworkDto: UpdatePartnerNetworkDto,
  ) {
    return this.partnerService.updatePartnerNetwork(
      hostId,
      networkId,
      updateNetworkDto,
    );
  }
}

@ApiTags('Partner Authentication')
@Controller('partner-auth')
export class PartnerAuthController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('validate')
  @ApiOperation(PartnerDocs.validatePartnerToken.operation)
  @ApiResponse(PartnerDocs.validatePartnerToken.responses.success[0])
  @ApiResponse(PartnerDocs.validatePartnerToken.responses.error[0])
  @HttpCode(HttpStatus.OK)
  async validatePartnerToken(
    @Headers('x-partner-token') token: string,
    @Headers('x-partner-host') host: string,
  ) {
    return this.partnerService.validatePartnerToken(token, host);
  }
}
