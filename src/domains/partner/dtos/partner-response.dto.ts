import { ApiProperty } from '@nestjs/swagger';

export class PartnerNetworkResponseDto {
  @ApiProperty({
    description: 'Network ID',
    example: 'uuid-network-id',
  })
  id: string;

  @ApiProperty({
    description: 'Blockchain network',
    example: 'ethereum',
  })
  network: string;

  @ApiProperty({
    description: 'Whether this is the default network',
    example: true,
  })
  default: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-20T10:00:00Z',
  })
  createdAt: Date;
}

export class PartnerHostResponseDto {
  @ApiProperty({
    description: 'Host ID',
    example: 'uuid-host-id',
  })
  id: string;

  @ApiProperty({
    description: 'Host domain',
    example: 'api.techpartner.com',
  })
  host: string;

  @ApiProperty({
    description: 'Host slug',
    example: 'tech-partner-host',
  })
  slug: string;

  @ApiProperty({
    description: 'Access token for authentication',
    example: 'token-123-abc',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent host',
    example: false,
  })
  isUcTalent: boolean;

  @ApiProperty({
    description: 'Partner ID',
    example: 'uuid-partner-id',
  })
  partnerId: string;

  @ApiProperty({
    description: 'Associated networks',
    type: [PartnerNetworkResponseDto],
  })
  networks: PartnerNetworkResponseDto[];

  @ApiProperty({
    description: 'Number of jobs posted by this host',
    example: 15,
  })
  jobsCount?: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-20T10:00:00Z',
  })
  updatedAt: Date;
}

export class PartnerResponseDto {
  @ApiProperty({
    description: 'Partner ID',
    example: 'uuid-partner-id',
  })
  id: string;

  @ApiProperty({
    description: 'Partner name',
    example: 'Tech Partner Solutions',
  })
  name: string;

  @ApiProperty({
    description: 'Partner slug',
    example: 'tech-partner-solutions',
  })
  slug: string;

  @ApiProperty({
    description: 'Whether this is a UC Talent partner',
    example: false,
  })
  isUcTalent: boolean;

  @ApiProperty({
    description: 'Associated hosts',
    type: [PartnerHostResponseDto],
  })
  hosts?: PartnerHostResponseDto[];

  @ApiProperty({
    description: 'Number of hosts',
    example: 3,
  })
  hostsCount?: number;

  @ApiProperty({
    description: 'Number of networks',
    example: 5,
  })
  networksCount?: number;

  @ApiProperty({
    description: 'Number of jobs',
    example: 25,
  })
  jobsCount?: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-20T10:00:00Z',
  })
  updatedAt: Date;
}

export class PartnerStatsDto {
  @ApiProperty({
    description: 'Host statistics',
  })
  hosts: {
    total: number;
    active: number;
    inactive: number;
  };

  @ApiProperty({
    description: 'Network statistics',
  })
  networks: {
    total: number;
    ethereum: number;
    base: number;
    bnb: number;
    coti_v2: number;
  };

  @ApiProperty({
    description: 'Job statistics',
  })
  jobs: {
    total: number;
    active: number;
    closed: number;
    expired: number;
  };

  @ApiProperty({
    description: 'Activity statistics',
  })
  activity: {
    jobsThisMonth: number;
    jobsLastMonth: number;
    growthRate: number;
  };
}