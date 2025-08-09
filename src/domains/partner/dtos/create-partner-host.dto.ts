import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreatePartnerNetworkDto {
  @ApiProperty({
    description: 'Blockchain network',
    example: 'ethereum',
    enum: ['coti_v2', 'base', 'bnb', 'ethereum'],
  })
  @IsString()
  @IsIn(['coti_v2', 'base', 'bnb', 'ethereum'])
  network: string;

  @ApiProperty({
    description: 'Whether this is the default network for the host',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean;
}

export class CreatePartnerHostDto {
  @ApiProperty({
    description: 'Host domain or URL',
    example: 'api.techpartner.com',
  })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({
    description: 'Host slug (unique identifier)',
    example: 'tech-partner-host',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Partner ID this host belongs to',
    example: 'uuid-partner-id',
  })
  @IsUUID()
  partnerId: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent host',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;

  @ApiProperty({
    description: 'Networks associated with this host',
    type: [CreatePartnerNetworkDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartnerNetworkDto)
  networks?: CreatePartnerNetworkDto[];
}
