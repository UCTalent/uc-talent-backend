# Admin Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic cho Admin domain trong NestJS.

## 🏗️ Admin Domain Architecture

### Core Features

- **Dashboard Management**: Statistics, charts, real-time data
- **User Management**: CRUD operations, status management
- **Job Management**: Job approval, status updates, bulk actions
- **Talent Management**: Profile review, verification
- **Payment Management**: Payment approval, distribution tracking
- **System Management**: Settings, configurations, audit logs

---

## 📊 Dashboard Management

### 1. Get Dashboard Statistics

#### Endpoint: `GET /api/admin/dashboard`

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "totalJobs": 89,
      "totalTalents": 890,
      "totalPayments": 156,
      "activeJobs": 45,
      "pendingPayments": 23,
      "recentApplications": 12
    },
    "charts": {
      "jobStatusDistribution": [
        { "status": "active", "count": 45 },
        { "status": "closed", "count": 23 },
        { "status": "expired", "count": 21 }
      ],
      "paymentStatusDistribution": [
        { "status": "pending", "count": 23 },
        { "status": "completed", "count": 133 }
      ],
      "monthlyJobTrends": [
        { "month": "2024-01", "count": 15 },
        { "month": "2024-02", "count": 23 }
      ]
    },
    "recentActivities": [
      {
        "id": "activity-1",
        "type": "job_created",
        "title": "New job posted",
        "description": "Senior Developer at Tech Corp",
        "timestamp": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

#### NestJS Implementation

```typescript
// admin.controller.ts
@Get('dashboard')
@UseGuards(AdminGuard)
async getDashboard() {
  return this.adminService.getDashboardStats();
}

// admin.service.ts
async getDashboardStats() {
  const [
    totalUsers,
    totalJobs,
    totalTalents,
    totalPayments,
    activeJobs,
    pendingPayments,
    recentApplications
  ] = await Promise.all([
    this.userRepository.count(),
    this.jobRepository.count(),
    this.talentRepository.count(),
    this.paymentRepository.count(),
    this.jobRepository.count({ where: { status: 'active' } }),
    this.paymentRepository.count({ where: { status: 'pending' } }),
    this.jobApplyRepository.count({
      where: { createdAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) }
    })
  ]);

  const jobStatusDistribution = await this.jobRepository
    .createQueryBuilder('job')
    .select('job.status', 'status')
    .addSelect('COUNT(*)', 'count')
    .groupBy('job.status')
    .getRawMany();

  const recentActivities = await this.getRecentActivities();

  return {
    success: true,
    data: {
      stats: {
        totalUsers,
        totalJobs,
        totalTalents,
        totalPayments,
        activeJobs,
        pendingPayments,
        recentApplications
      },
      charts: {
        jobStatusDistribution,
        paymentStatusDistribution: await this.getPaymentStatusDistribution(),
        monthlyJobTrends: await this.getMonthlyJobTrends()
      },
      recentActivities
    }
  };
}
```

---

## 👥 User Management

### 1. Get Users List

#### Endpoint: `GET /api/admin/users`

#### Query Parameters

```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  search?: string;      // Search by email, name
  status?: string;      // active, inactive, suspended
  role?: string;        // user, admin
  sortBy?: string;      // createdAt, email, status
  sortOrder?: string;   // ASC, DESC
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "status": "active",
        "role": "user",
        "createdAt": "2024-01-20T10:00:00Z",
        "lastLoginAt": "2024-01-19T15:30:00Z",
        "talent": {
          "id": "talent-uuid",
          "headline": "Senior Developer",
          "status": "active"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1250,
      "totalPages": 63
    }
  }
}
```

### 2. Update User Status

#### Endpoint: `PATCH /api/admin/users/:id/status`

#### Request Body

```json
{
  "status": "suspended",
  "reason": "Violation of terms"
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "status": "suspended",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

#### NestJS Implementation

```typescript
// admin.controller.ts
@Get('users')
@UseGuards(AdminGuard)
async getUsers(@Query() query: AdminUserQueryDto) {
  return this.adminService.getUsers(query);
}

@Patch('users/:id/status')
@UseGuards(AdminGuard)
async updateUserStatus(
  @Param('id') id: string,
  @Body() body: UpdateUserStatusDto
) {
  return this.adminService.updateUserStatus(id, body);
}

// admin.service.ts
async getUsers(query: AdminUserQueryDto) {
  const { page = 1, limit = 20, search, status, role, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
  const skip = (page - 1) * limit;

  const queryBuilder = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.talent', 'talent');

  if (search) {
    queryBuilder.where(
      'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
      { search: `%${search}%` }
    );
  }

  if (status) {
    queryBuilder.andWhere('user.status = :status', { status });
  }

  if (role) {
    queryBuilder.andWhere('user.role = :role', { role });
  }

  queryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');

  const [users, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return {
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  };
}

async updateUserStatus(id: string, body: UpdateUserStatusDto) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.status = body.status;
  user.statusReason = body.reason;
  user.updatedAt = new Date();

  await this.userRepository.save(user);

  // Log admin action
  await this.auditLogService.log({
    action: 'UPDATE_USER_STATUS',
    adminId: body.adminId,
    targetId: id,
    details: { status: body.status, reason: body.reason }
  });

  return {
    success: true,
    data: {
      id: user.id,
      status: user.status,
      updatedAt: user.updatedAt
    }
  };
}
```

---

## 💼 Job Management

### 1. Get Jobs List

#### Endpoint: `GET /api/admin/jobs`

#### Query Parameters

```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: string;      // active, closed, expired, pending
  organization?: string;
  speciality?: string;
  dateFrom?: string;
  dateTo?: string;
}
```

#### Response Success (200)

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-uuid",
        "title": "Senior Developer",
        "status": "active",
        "organization": {
          "id": "org-uuid",
          "name": "Tech Corp"
        },
        "speciality": {
          "id": "spec-uuid",
          "name": "Software Development"
        },
        "salaryFrom": 80000,
        "salaryTo": 120000,
        "currency": "USD",
        "postedDate": "2024-01-15T10:00:00Z",
        "expiredDate": "2024-02-15T10:00:00Z",
        "applicationsCount": 15,
        "referralsCount": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 89,
      "totalPages": 5
    }
  }
}
```

### 2. Update Job Status

#### Endpoint: `PATCH /api/admin/jobs/:id/status`

#### Request Body

```json
{
  "status": "active",
  "reason": "Approved by admin"
}
```

### 3. Bulk Job Actions

#### Endpoint: `POST /api/admin/jobs/bulk-actions`

#### Request Body

```json
{
  "action": "approve",
  "jobIds": ["job-1", "job-2", "job-3"],
  "reason": "Bulk approval"
}
```

#### NestJS Implementation

```typescript
// admin.controller.ts
@Get('jobs')
@UseGuards(AdminGuard)
async getJobs(@Query() query: AdminJobQueryDto) {
  return this.adminService.getJobs(query);
}

@Patch('jobs/:id/status')
@UseGuards(AdminGuard)
async updateJobStatus(
  @Param('id') id: string,
  @Body() body: UpdateJobStatusDto
) {
  return this.adminService.updateJobStatus(id, body);
}

@Post('jobs/bulk-actions')
@UseGuards(AdminGuard)
async bulkJobActions(@Body() body: BulkJobActionDto) {
  return this.adminService.executeBulkJobAction(body);
}

// admin.service.ts
async getJobs(query: AdminJobQueryDto) {
  const { page = 1, limit = 20, search, status, organization, speciality, dateFrom, dateTo } = query;
  const skip = (page - 1) * limit;

  const queryBuilder = this.jobRepository.createQueryBuilder('job')
    .leftJoinAndSelect('job.organization', 'organization')
    .leftJoinAndSelect('job.speciality', 'speciality')
    .leftJoinAndSelect('job.city', 'city')
    .leftJoinAndSelect('job.country', 'country');

  if (search) {
    queryBuilder.where('job.title ILIKE :search', { search: `%${search}%` });
  }

  if (status) {
    queryBuilder.andWhere('job.status = :status', { status });
  }

  if (organization) {
    queryBuilder.andWhere('organization.id = :organization', { organization });
  }

  if (speciality) {
    queryBuilder.andWhere('speciality.id = :speciality', { speciality });
  }

  if (dateFrom) {
    queryBuilder.andWhere('job.postedDate >= :dateFrom', { dateFrom });
  }

  if (dateTo) {
    queryBuilder.andWhere('job.postedDate <= :dateTo', { dateTo });
  }

  const [jobs, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .orderBy('job.createdAt', 'DESC')
    .getManyAndCount();

  // Get additional stats
  const jobsWithStats = await Promise.all(
    jobs.map(async (job) => {
      const [applicationsCount, referralsCount] = await Promise.all([
        this.jobApplyRepository.count({ where: { jobId: job.id } }),
        this.jobReferralRepository.count({ where: { jobId: job.id } })
      ]);

      return {
        ...job,
        applicationsCount,
        referralsCount
      };
    })
  );

  return {
    success: true,
    data: {
      jobs: jobsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  };
}

async updateJobStatus(id: string, body: UpdateJobStatusDto) {
  const job = await this.jobRepository.findOne({ where: { id } });
  if (!job) {
    throw new NotFoundException('Job not found');
  }

  job.status = body.status;
  job.statusReason = body.reason;
  job.updatedAt = new Date();

  await this.jobRepository.save(job);

  // Log admin action
  await this.auditLogService.log({
    action: 'UPDATE_JOB_STATUS',
    adminId: body.adminId,
    targetId: id,
    details: { status: body.status, reason: body.reason }
  });

  return {
    success: true,
    data: {
      id: job.id,
      status: job.status,
      updatedAt: job.updatedAt
    }
  };
}
```

---

## 👨‍💼 Talent Management

### 1. Get Talents List

#### Endpoint: `GET /api/admin/talents`

#### Query Parameters

```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: string;      // active, inactive, under_review
  experienceLevel?: string;
  englishProficiency?: string;
  speciality?: string;
}
```

### 2. Review Talent Profile

#### Endpoint: `POST /api/admin/talents/:id/review`

#### Request Body

```json
{
  "action": "approve",
  "notes": "Profile looks good",
  "status": "active"
}
```

---

## 💰 Payment Management

### 1. Get Payment Distributions

#### Endpoint: `GET /api/admin/payment-distributions`

#### Query Parameters

```typescript
{
  page?: number;
  limit?: number;
  status?: string;      // pending, completed, failed
  role?: string;        // candidate, referrer, hiring_manager
  paymentType?: string; // referral_success, apply_success
  dateFrom?: string;
  dateTo?: string;
}
```

### 2. Approve Payment

#### Endpoint: `POST /api/admin/payment-distributions/:id/approve`

#### Request Body

```json
{
  "approved": true,
  "notes": "Payment approved",
  "transactionHash": "0xabc123..."
}
```

---

## ⚙️ System Management

### 1. Get System Settings

#### Endpoint: `GET /api/admin/settings`

### 2. Update System Settings

#### Endpoint: `PATCH /api/admin/settings`

#### Request Body

```json
{
  "platformFee": 0.05,
  "maxJobDuration": 90,
  "autoApproveJobs": false,
  "maintenanceMode": false
}
```

### 3. Get Audit Logs

#### Endpoint: `GET /api/admin/audit-logs`

#### Query Parameters

```typescript
{
  page?: number;
  limit?: number;
  action?: string;
  adminId?: string;
  dateFrom?: string;
  dateTo?: string;
}
```

---

## 📝 DTOs

### 1. Admin User Query DTO

```typescript
// admin-user-query.dto.ts
export class AdminUserQueryDto {
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
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;
}
```

### 2. Update User Status DTO

```typescript
// update-user-status.dto.ts
export class UpdateUserStatusDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  adminId: string;
}
```

### 3. Bulk Job Action DTO

```typescript
// bulk-job-action.dto.ts
export class BulkJobActionDto {
  @IsString()
  action: string;

  @IsArray()
  @IsString({ each: true })
  jobIds: string[];

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  adminId: string;
}
```

---

## 🔧 Services Implementation

### 1. Admin Service

```typescript
// admin.service.ts
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Talent)
    private talentRepository: Repository<Talent>,
    @InjectRepository(PaymentDistribution)
    private paymentRepository: Repository<PaymentDistribution>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async getDashboardStats() {
    // Implementation như trên
  }

  async getUsers(query: AdminUserQueryDto) {
    // Implementation như trên
  }

  async updateUserStatus(id: string, body: UpdateUserStatusDto) {
    // Implementation như trên
  }

  async getJobs(query: AdminJobQueryDto) {
    // Implementation như trên
  }

  async updateJobStatus(id: string, body: UpdateJobStatusDto) {
    // Implementation như trên
  }

  async executeBulkJobAction(body: BulkJobActionDto) {
    const { action, jobIds, reason, adminId } = body;

    const jobs = await this.jobRepository.find({
      where: { id: In(jobIds) },
    });

    switch (action) {
      case 'approve':
        await Promise.all(
          jobs.map((job) => {
            job.status = 'active';
            job.statusReason = reason;
            return this.jobRepository.save(job);
          })
        );
        break;
      case 'reject':
        await Promise.all(
          jobs.map((job) => {
            job.status = 'rejected';
            job.statusReason = reason;
            return this.jobRepository.save(job);
          })
        );
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    // Log bulk action
    await this.auditLogService.log({
      action: 'BULK_JOB_ACTION',
      adminId,
      details: { action, jobIds, reason },
    });

    return {
      success: true,
      data: {
        action,
        processedCount: jobs.length,
        message: `Successfully ${action}ed ${jobs.length} jobs`,
      },
    };
  }
}
```

---

## 📋 Checklist

- [ ] Dashboard Management
- [ ] User Management
- [ ] Job Management
- [ ] Talent Management
- [ ] Payment Management
- [ ] System Management
- [ ] Audit Logging
- [ ] DTOs
- [ ] Services
- [ ] Controllers
- [ ] Guards
- [ ] Unit Tests
- [ ] Integration Tests

---

**🎉 Ready for implementation!**
