import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

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
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean;
}

export class UpdatePartnerNetworkDto {
  @ApiProperty({
    description: 'Whether this is the default network for the host',
    example: true,
  })
  @IsBoolean()
  default: boolean;
}
