# Organization Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic cho Organization domain trong NestJS.

## 🏗️ Organization Domain Architecture

### Core Features
- **Organization Management**: CRUD operations, profile management
- **Organization Search**: Full-text search, filtering
- **Logo Management**: File upload, image processing
- **Location Management**: City, country associations
- **Industry Classification**: Industry categorization
- **Job Association**: Jobs posted by organization

---

## 🏢 Organization Management

### 1. Get Organizations List

#### Endpoint: `GET /api/v1/organizations`

#### Query Parameters
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  search?: string;      // Search by name
  status?: string;      // active, inactive
  industry?: string;    // Industry ID
  country?: string;     // Country ID
  city?: string;        // City ID
  size?: string;        // startup, small, medium, large
  orgType?: string;     // company, agency, startup
  sortBy?: string;      // name, created_at, updated_at
  sortOrder?: string;   // ASC, DESC
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "org-uuid",
        "name": "Tech Corp",
        "website": "https://techcorp.com",
        "contactEmail": "contact@techcorp.com",
        "contactPhone": "+1234567890",
        "orgType": "company",
        "about": "Leading technology company...",
        "foundDate": "2020-01-15",
        "size": "large",
        "address": "123 Tech Street, Silicon Valley",
        "status": "active",
        "logo": {
          "url": "https://storage.example.com/logos/techcorp.png",
          "filename": "techcorp-logo.png"
        },
        "industry": {
          "id": "industry-uuid",
          "name": "Technology"
        },
        "city": {
          "id": "city-uuid",
          "name": "San Francisco"
        },
        "country": {
          "id": "country-uuid",
          "name": "United States"
        },
        "jobsCount": 15,
        "createdAt": "2024-01-20T10:00:00Z",
        "updatedAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 2. Get Organization Details

#### Endpoint: `GET /api/v1/organizations/:id`

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "name": "Tech Corp",
    "website": "https://techcorp.com",
    "contactEmail": "contact@techcorp.com",
    "contactPhone": "+1234567890",
    "orgType": "company",
    "about": "Leading technology company specializing in AI and machine learning...",
    "foundDate": "2020-01-15",
    "size": "large",
    "address": "123 Tech Street, Silicon Valley, CA 94105",
    "status": "active",
    "logo": {
      "url": "https://storage.example.com/logos/techcorp.png",
      "filename": "techcorp-logo.png",
      "size": 1024000,
      "contentType": "image/png"
    },
    "socialLinks": {
      "github": "https://github.com/techcorp",
      "linkedin": "https://linkedin.com/company/techcorp",
      "twitter": "https://twitter.com/techcorp"
    },
    "industry": {
      "id": "industry-uuid",
      "name": "Technology",
      "description": "Technology and software development"
    },
    "city": {
      "id": "city-uuid",
      "name": "San Francisco",
      "state": "California"
    },
    "country": {
      "id": "country-uuid",
      "name": "United States",
      "code": "US"
    },
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
      "activeJobs": 8,
      "totalEmployees": 500,
      "averageSalary": 120000
    },
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 3. Create Organization

#### Endpoint: `POST /api/v1/organizations`

#### Request Body
```json
{
  "name": "New Tech Startup",
  "website": "https://newtechstartup.com",
  "contactEmail": "contact@newtechstartup.com",
  "contactPhone": "+1234567890",
  "orgType": "startup",
  "about": "Innovative startup focused on blockchain technology...",
  "foundDate": "2023-06-15",
  "size": "small",
  "address": "456 Innovation Drive, San Francisco, CA",
  "status": "active",
  "industryId": "industry-uuid",
  "cityId": "city-uuid",
  "countryId": "country-uuid",
  "socialLinks": {
    "github": "https://github.com/newtechstartup",
    "linkedin": "https://linkedin.com/company/newtechstartup",
    "twitter": "https://twitter.com/newtechstartup"
  }
}
```

#### Response Success (201)
```json
{
  "success": true,
  "data": {
    "id": "org-uuid",
    "name": "New Tech Startup",
    "website": "https://newtechstartup.com",
    "contactEmail": "contact@newtechstartup.com",
    "contactPhone": "+1234567890",
    "orgType": "startup",
    "about": "Innovative startup focused on blockchain technology...",
    "foundDate": "2023-06-15",
    "size": "small",
    "address": "456 Innovation Drive, San Francisco, CA",
    "status": "active",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 4. Update Organization

#### Endpoint: `PATCH /api/v1/organizations/:id`

#### Request Body
```json
{
  "name": "Updated Tech Startup",
  "about": "Updated description...",
  "size": "medium",
  "status": "active"
}
```

### 5. Delete Organization

#### Endpoint: `DELETE /api/v1/organizations/:id`

#### Response Success (204)
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

---

## 🔍 Organization Search

### 1. Search Organizations

#### Endpoint: `GET /api/v1/organizations/search`

#### Query Parameters
```typescript
{
  query: string;        // Search term
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  filters?: {
    industry?: string;
    country?: string;
    city?: string;
    size?: string;
    orgType?: string;
  }
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "org-uuid",
        "name": "Tech Corp",
        "website": "https://techcorp.com",
        "logo": {
          "url": "https://storage.example.com/logos/techcorp.png"
        },
        "industry": {
          "id": "industry-uuid",
          "name": "Technology"
        },
        "city": {
          "id": "city-uuid",
          "name": "San Francisco"
        },
        "country": {
          "id": "country-uuid",
          "name": "United States"
        },
        "jobsCount": 15,
        "relevanceScore": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "searchStats": {
      "query": "tech",
      "totalResults": 45,
      "searchTime": 0.15
    }
  }
}
```

---

## 🖼️ Logo Management

### 1. Upload Organization Logo

#### Endpoint: `POST /api/v1/organizations/:id/logo`

#### Request Body (Multipart Form)
```typescript
{
  logo: File;  // Image file (PNG, JPG, JPEG)
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "logo": {
      "url": "https://storage.example.com/logos/org-uuid.png",
      "filename": "organization-logo.png",
      "size": 1024000,
      "contentType": "image/png",
      "dimensions": {
        "width": 500,
        "height": 500
      }
    }
  }
}
```

### 2. Delete Organization Logo

#### Endpoint: `DELETE /api/v1/organizations/:id/logo`

#### Response Success (200)
```json
{
  "success": true,
  "message": "Logo deleted successfully"
}
```

---

## 📊 Organization Statistics

### 1. Get Organization Stats

#### Endpoint: `GET /api/v1/organizations/:id/stats`

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "jobs": {
      "total": 15,
      "active": 8,
      "closed": 5,
      "expired": 2
    },
    "applications": {
      "total": 150,
      "pending": 45,
      "reviewed": 80,
      "hired": 25
    },
    "referrals": {
      "total": 30,
      "successful": 12,
      "pending": 18
    },
    "payments": {
      "total": 25000,
      "pending": 5000,
      "completed": 20000
    },
    "growth": {
      "jobsThisMonth": 5,
      "jobsLastMonth": 3,
      "growthRate": 66.67
    }
  }
}
```

---

## 📝 DTOs

### 1. Create Organization DTO

```typescript
// create-organization.dto.ts
export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  orgType?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsDateString()
  foundDate?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  industryId?: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;

  @IsOptional()
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
```

### 2. Update Organization DTO

```typescript
// update-organization.dto.ts
export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  orgType?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsDateString()
  foundDate?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  industryId?: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;

  @IsOptional()
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
```

### 3. Organization Query DTO

```typescript
// organization-query.dto.ts
export class OrganizationQueryDto {
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
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  industry?: string;

  @IsOptional()
  @IsUUID()
  country?: string;

  @IsOptional()
  @IsUUID()
  city?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  orgType?: string;

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

### 1. Organization Service

```typescript
// organization.service.ts
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private fileService: FileService
  ) {}

  async getOrganizations(query: OrganizationQueryDto) {
    const { page = 1, limit = 20, search, status, industry, country, city, size, orgType, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.organizationRepository.createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .leftJoinAndSelect('org.logo', 'logo');

    if (search) {
      queryBuilder.where(
        'org.name ILIKE :search OR org.about ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('org.status = :status', { status });
    }

    if (industry) {
      queryBuilder.andWhere('industry.id = :industry', { industry });
    }

    if (country) {
      queryBuilder.andWhere('country.id = :country', { country });
    }

    if (city) {
      queryBuilder.andWhere('city.id = :city', { city });
    }

    if (size) {
      queryBuilder.andWhere('org.size = :size', { size });
    }

    if (orgType) {
      queryBuilder.andWhere('org.orgType = :orgType', { orgType });
    }

    queryBuilder.orderBy(`org.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [organizations, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get jobs count for each organization
    const organizationsWithStats = await Promise.all(
      organizations.map(async (org) => {
        const jobsCount = await this.jobRepository.count({ where: { organizationId: org.id } });
        return {
          ...org,
          jobsCount
        };
      })
    );

    return {
      success: true,
      data: {
        organizations: organizationsWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['industry', 'city', 'country', 'logo', 'jobs']
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Get additional stats
    const [totalJobs, activeJobs] = await Promise.all([
      this.jobRepository.count({ where: { organizationId: id } }),
      this.jobRepository.count({ where: { organizationId: id, status: 'active' } })
    ]);

    return {
      success: true,
      data: {
        ...organization,
        stats: {
          totalJobs,
          activeJobs
        }
      }
    };
  }

  async createOrganization(createDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(createDto);
    const savedOrganization = await this.organizationRepository.save(organization);

    return {
      success: true,
      data: savedOrganization
    };
  }

  async updateOrganization(id: string, updateDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateDto);
    const updatedOrganization = await this.organizationRepository.save(organization);

    return {
      success: true,
      data: updatedOrganization
    };
  }

  async deleteOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.organizationRepository.remove(organization);

    return {
      success: true,
      message: 'Organization deleted successfully'
    };
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Upload file to storage
    const uploadedFile = await this.fileService.uploadFile(file, 'logos');

    // Update organization with logo info
    organization.logo = uploadedFile;
    await this.organizationRepository.save(organization);

    return {
      success: true,
      data: {
        logo: uploadedFile
      }
    };
  }

  async searchOrganizations(query: string, filters?: any) {
    const queryBuilder = this.organizationRepository.createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .leftJoinAndSelect('org.logo', 'logo');

    if (query) {
      queryBuilder.where(
        'org.name ILIKE :query OR org.about ILIKE :query',
        { query: `%${query}%` }
      );
    }

    if (filters) {
      if (filters.industry) {
        queryBuilder.andWhere('industry.id = :industry', { industry: filters.industry });
      }
      if (filters.country) {
        queryBuilder.andWhere('country.id = :country', { country: filters.country });
      }
      if (filters.city) {
        queryBuilder.andWhere('city.id = :city', { city: filters.city });
      }
      if (filters.size) {
        queryBuilder.andWhere('org.size = :size', { size: filters.size });
      }
      if (filters.orgType) {
        queryBuilder.andWhere('org.orgType = :orgType', { orgType: filters.orgType });
      }
    }

    const organizations = await queryBuilder.getMany();

    return {
      success: true,
      data: {
        organizations,
        searchStats: {
          query,
          totalResults: organizations.length,
          searchTime: 0.15 // Mock value
        }
      }
    };
  }
}
```

---

## 📋 Checklist

- [ ] Organization Management (CRUD)
- [ ] Organization Search
- [ ] Logo Management
- [ ] Organization Statistics
- [ ] DTOs
- [ ] Services
- [ ] Controllers
- [ ] File Upload
- [ ] Unit Tests
- [ ] Integration Tests

---

**🎉 Ready for implementation!** 