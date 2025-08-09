# Partner Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic cho Partner domain trong NestJS.

## 🏗️ Partner Domain Architecture

### Core Features

- **Partner Management**: Partner registration, profile management
- **Partner Host Management**: Host configuration, token management
- **Partner Network Management**: Blockchain network configuration
- **Partner Authentication**: Token-based authentication
- **Job Integration**: Partner-hosted job posting
- **API Integration**: Partner API endpoints

---

## 🤝 Partner Management

### 1. Get Partners List

#### Endpoint: `GET /api/v1/partners`

#### Query Parameters

```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  search?: string;      // Search by name
  isUcTalent?: boolean; // Filter UC Talent partners
  sortBy?: string;      // name, created_at, updated_at
  sortOrder?: string;   // ASC, DESC
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "partners": [
      {
        "id": "partner-uuid",
        "name": "Tech Partner",
        "slug": "tech-partner",
        "isUcTalent": false,
        "hostsCount": 3,
        "networksCount": 5,
        "jobsCount": 25,
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

### 2. Get Partner Details

#### Endpoint: `GET /api/v1/partners/:id`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "partner-uuid",
    "name": "Tech Partner",
    "slug": "tech-partner",
    "isUcTalent": false,
    "hosts": [
      {
        "id": "host-uuid",
        "host": "api.techpartner.com",
        "slug": "tech-host",
        "accessToken": "token-123",
        "isUcTalent": false,
        "networks": [
          {
            "id": "network-uuid",
            "network": "ethereum",
            "default": true
          }
        ],
        "jobsCount": 15,
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "stats": {
      "totalHosts": 3,
      "totalNetworks": 5,
      "totalJobs": 25,
      "activeJobs": 18
    },
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3. Create Partner

#### Endpoint: `POST /api/v1/partners`

#### Request Body

```json
{
  "name": "New Tech Partner",
  "slug": "new-tech-partner",
  "isUcTalent": false
}
```

#### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": "partner-uuid",
    "name": "New Tech Partner",
    "slug": "new-tech-partner",
    "isUcTalent": false,
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

---

## 🌐 Partner Host Management

### 1. Get Partner Hosts List

#### Endpoint: `GET /api/v1/partner-hosts`

#### Query Parameters

```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  partnerId?: string;   // Filter by partner
  host?: string;        // Filter by host
  isUcTalent?: boolean; // Filter UC Talent hosts
  sortBy?: string;      // host, created_at, updated_at
  sortOrder?: string;   // ASC, DESC
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "partnerHosts": [
      {
        "id": "host-uuid",
        "host": "api.techpartner.com",
        "slug": "tech-host",
        "accessToken": "token-123",
        "isUcTalent": false,
        "partner": {
          "id": "partner-uuid",
          "name": "Tech Partner",
          "slug": "tech-partner"
        },
        "networks": [
          {
            "id": "network-uuid",
            "network": "ethereum",
            "default": true
          }
        ],
        "jobsCount": 15,
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 2. Get Partner Host Details

#### Endpoint: `GET /api/v1/partner-hosts/:id`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "host-uuid",
    "host": "api.techpartner.com",
    "slug": "tech-host",
    "accessToken": "token-123",
    "isUcTalent": false,
    "partner": {
      "id": "partner-uuid",
      "name": "Tech Partner",
      "slug": "tech-partner"
    },
    "networks": [
      {
        "id": "network-uuid",
        "network": "ethereum",
        "default": true
      },
      {
        "id": "network-uuid-2",
        "network": "base",
        "default": false
      }
    ],
    "jobs": [
      {
        "id": "job-uuid",
        "title": "Senior Developer",
        "status": "active",
        "postedDate": "2024-01-15T10:00:00Z"
      }
    ],
    "stats": {
      "totalJobs": 15,
      "activeJobs": 12,
      "totalNetworks": 3
    },
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3. Create Partner Host

#### Endpoint: `POST /api/v1/partner-hosts`

#### Request Body

```json
{
  "host": "api.newpartner.com",
  "slug": "new-host",
  "partnerId": "partner-uuid",
  "isUcTalent": false,
  "networks": [
    {
      "network": "ethereum",
      "default": true
    },
    {
      "network": "base",
      "default": false
    }
  ]
}
```

#### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": "host-uuid",
    "host": "api.newpartner.com",
    "slug": "new-host",
    "accessToken": "generated-token-123",
    "isUcTalent": false,
    "partnerId": "partner-uuid",
    "networks": [
      {
        "id": "network-uuid",
        "network": "ethereum",
        "default": true
      },
      {
        "id": "network-uuid-2",
        "network": "base",
        "default": false
      }
    ],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 4. Regenerate Access Token

#### Endpoint: `POST /api/v1/partner-hosts/:id/regenerate-token`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "host-uuid",
    "accessToken": "new-generated-token-456",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

---

## 🔗 Partner Network Management

### 1. Get Partner Networks

#### Endpoint: `GET /api/v1/partner-hosts/:hostId/networks`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "networks": [
      {
        "id": "network-uuid",
        "network": "ethereum",
        "default": true,
        "createdAt": "2024-01-20T10:00:00Z"
      },
      {
        "id": "network-uuid-2",
        "network": "base",
        "default": false,
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

### 2. Add Network to Partner Host

#### Endpoint: `POST /api/v1/partner-hosts/:hostId/networks`

#### Request Body

```json
{
  "network": "bnb",
  "default": false
}
```

#### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": "network-uuid",
    "network": "bnb",
    "default": false,
    "partnerHostId": "host-uuid",
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3. Update Network Default Status

#### Endpoint: `PATCH /api/v1/partner-hosts/:hostId/networks/:networkId`

#### Request Body

```json
{
  "default": true
}
```

---

## 🔐 Partner Authentication

### 1. Validate Partner Token

#### Endpoint: `POST /api/v1/partner-auth/validate`

#### Request Headers

```typescript
{
  'X-Partner-Token': 'partner-access-token',
  'X-Partner-Host': 'api.partner.com'
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "partnerHost": {
      "id": "host-uuid",
      "host": "api.partner.com",
      "slug": "partner-host",
      "isUcTalent": false
    },
    "partner": {
      "id": "partner-uuid",
      "name": "Tech Partner",
      "slug": "tech-partner"
    },
    "permissions": {
      "canPostJobs": true,
      "canReadJobs": true,
      "canUpdateJobs": true
    }
  }
}
```

#### Response Error (401)

```json
{
  "success": false,
  "error": "Invalid partner token"
}
```

---

## 📊 Partner Statistics

### 1. Get Partner Stats

#### Endpoint: `GET /api/v1/partners/:id/stats`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "hosts": {
      "total": 3,
      "active": 3,
      "inactive": 0
    },
    "networks": {
      "total": 5,
      "ethereum": 2,
      "base": 2,
      "bnb": 1
    },
    "jobs": {
      "total": 25,
      "active": 18,
      "closed": 5,
      "expired": 2
    },
    "activity": {
      "jobsThisMonth": 5,
      "jobsLastMonth": 3,
      "growthRate": 66.67
    }
  }
}
```

---

## 📝 DTOs

### 1. Create Partner DTO

```typescript
// create-partner.dto.ts
export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;
}
```

### 2. Create Partner Host DTO

```typescript
// create-partner-host.dto.ts
export class CreatePartnerHostDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @IsUUID()
  partnerId: string;

  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartnerNetworkDto)
  networks?: CreatePartnerNetworkDto[];
}

export class CreatePartnerNetworkDto {
  @IsString()
  @IsIn(['coti_v2', 'base', 'bnb', 'ethereum'])
  network: string;

  @IsOptional()
  @IsBoolean()
  default?: boolean;
}
```

### 3. Partner Query DTO

```typescript
// partner-query.dto.ts
export class PartnerQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isUcTalent?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;
}
```

---

## 🔧 Services Implementation

### 1. Partner Service

```typescript
// partner.service.ts
@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerHost)
    private partnerHostRepository: Repository<PartnerHost>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>
  ) {}

  async getPartners(query: PartnerQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      isUcTalent,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.partnerRepository
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.partnerHosts', 'hosts');

    if (search) {
      queryBuilder.where('partner.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (isUcTalent !== undefined) {
      queryBuilder.andWhere('partner.isUcTalent = :isUcTalent', { isUcTalent });
    }

    queryBuilder.orderBy(`partner.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [partners, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get additional stats for each partner
    const partnersWithStats = await Promise.all(
      partners.map(async (partner) => {
        const [hostsCount, networksCount, jobsCount] = await Promise.all([
          this.partnerHostRepository.count({
            where: { partnerId: partner.id },
          }),
          this.getPartnerNetworksCount(partner.id),
          this.jobRepository.count({
            where: { partnerHost: { partnerId: partner.id } },
          }),
        ]);

        return {
          ...partner,
          hostsCount,
          networksCount,
          jobsCount,
        };
      })
    );

    return {
      success: true,
      data: {
        partners: partnersWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getPartnerById(id: string) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: ['partnerHosts', 'partnerHosts.networks', 'partnerHosts.jobs'],
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return {
      success: true,
      data: partner,
    };
  }

  async createPartner(createDto: CreatePartnerDto) {
    // Check if slug already exists
    const existingPartner = await this.partnerRepository.findOne({
      where: { slug: createDto.slug },
    });

    if (existingPartner) {
      throw new BadRequestException('Partner with this slug already exists');
    }

    const partner = this.partnerRepository.create(createDto);
    const savedPartner = await this.partnerRepository.save(partner);

    return {
      success: true,
      data: savedPartner,
    };
  }

  private async getPartnerNetworksCount(partnerId: string): Promise<number> {
    const result = await this.partnerHostRepository
      .createQueryBuilder('host')
      .leftJoin('host.networks', 'networks')
      .where('host.partnerId = :partnerId', { partnerId })
      .getCount();

    return result;
  }
}
```

### 2. Partner Host Service

```typescript
// partner-host.service.ts
@Injectable()
export class PartnerHostService {
  constructor(
    @InjectRepository(PartnerHost)
    private partnerHostRepository: Repository<PartnerHost>,
    @InjectRepository(PartnerHostNetwork)
    private partnerHostNetworkRepository: Repository<PartnerHostNetwork>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>
  ) {}

  async getPartnerHosts(query: PartnerHostQueryDto) {
    const {
      page = 1,
      limit = 20,
      partnerId,
      host,
      isUcTalent,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.partnerHostRepository
      .createQueryBuilder('host')
      .leftJoinAndSelect('host.partner', 'partner')
      .leftJoinAndSelect('host.networks', 'networks');

    if (partnerId) {
      queryBuilder.andWhere('host.partnerId = :partnerId', { partnerId });
    }

    if (host) {
      queryBuilder.andWhere('host.host ILIKE :host', { host: `%${host}%` });
    }

    if (isUcTalent !== undefined) {
      queryBuilder.andWhere('host.isUcTalent = :isUcTalent', { isUcTalent });
    }

    queryBuilder.orderBy(`host.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [partnerHosts, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get jobs count for each host
    const hostsWithStats = await Promise.all(
      partnerHosts.map(async (host) => {
        const jobsCount = await this.jobRepository.count({
          where: { partnerHostId: host.id },
        });
        return {
          ...host,
          jobsCount,
        };
      })
    );

    return {
      success: true,
      data: {
        partnerHosts: hostsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async createPartnerHost(createDto: CreatePartnerHostDto) {
    // Check if host already exists
    const existingHost = await this.partnerHostRepository.findOne({
      where: { host: createDto.host },
    });

    if (existingHost) {
      throw new BadRequestException(
        'Partner host with this host already exists'
      );
    }

    // Generate access token
    const accessToken = this.generateAccessToken();

    const partnerHost = this.partnerHostRepository.create({
      ...createDto,
      accessToken,
    });

    const savedPartnerHost = await this.partnerHostRepository.save(partnerHost);

    // Create networks if provided
    if (createDto.networks && createDto.networks.length > 0) {
      const networks = createDto.networks.map((network) => ({
        ...network,
        partnerHostId: savedPartnerHost.id,
      }));

      await this.partnerHostNetworkRepository.save(networks);
    }

    return {
      success: true,
      data: savedPartnerHost,
    };
  }

  async regenerateAccessToken(id: string) {
    const partnerHost = await this.partnerHostRepository.findOne({
      where: { id },
    });
    if (!partnerHost) {
      throw new NotFoundException('Partner host not found');
    }

    const newAccessToken = this.generateAccessToken();
    partnerHost.accessToken = newAccessToken;
    partnerHost.updatedAt = new Date();

    await this.partnerHostRepository.save(partnerHost);

    return {
      success: true,
      data: {
        id: partnerHost.id,
        accessToken: newAccessToken,
        updatedAt: partnerHost.updatedAt,
      },
    };
  }

  private generateAccessToken(): string {
    return crypto.randomBytes(20).toString('hex');
  }
}
```

### 3. Partner Authentication Service

```typescript
// partner-auth.service.ts
@Injectable()
export class PartnerAuthService {
  constructor(
    @InjectRepository(PartnerHost)
    private partnerHostRepository: Repository<PartnerHost>
  ) {}

  async validatePartnerToken(token: string, host: string): Promise<any> {
    const partnerHost = await this.partnerHostRepository.findOne({
      where: { accessToken: token, host },
      relations: ['partner', 'networks'],
    });

    if (!partnerHost) {
      throw new UnauthorizedException('Invalid partner token');
    }

    return {
      success: true,
      data: {
        partnerHost: {
          id: partnerHost.id,
          host: partnerHost.host,
          slug: partnerHost.slug,
          isUcTalent: partnerHost.isUcTalent,
        },
        partner: {
          id: partnerHost.partner.id,
          name: partnerHost.partner.name,
          slug: partnerHost.partner.slug,
        },
        permissions: {
          canPostJobs: true,
          canReadJobs: true,
          canUpdateJobs: true,
        },
      },
    };
  }
}
```

---

## 📋 Checklist

- [ ] Partner Management (CRUD)
- [ ] Partner Host Management
- [ ] Partner Network Management
- [ ] Partner Authentication
- [ ] Partner Statistics
- [ ] DTOs
- [ ] Services
- [ ] Controllers
- [ ] Authentication Guards
- [ ] Unit Tests
- [ ] Integration Tests

---

**🎉 Ready for implementation!**
