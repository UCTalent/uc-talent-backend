# Job Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic liên quan đến domain Job trong hệ thống UC Talent.

## 🏗️ Job Domain Architecture

### Core Entities
- **Job**: Job posting chính
- **JobApply**: Job application từ talent
- **JobReferral**: Job referral từ user
- **ReferralLink**: Link referral cho job
- **JobClosureReason**: Lý do đóng job
- **Web3Event**: Web3 events cho job

### Supporting Entities
- **Organization**: Công ty đăng job
- **Speciality**: Chuyên môn của job
- **Skill**: Kỹ năng cần thiết
- **City/Country/Region**: Địa điểm
- **PartnerHost**: Partner hosting job

---

## 🔍 Job Listing & Search

### 1. Get Jobs (Index)

#### Endpoint: `GET /api/v1/jobs`

#### Query Parameters
```typescript
interface JobIndexQuery {
  page?: number;
  query?: string;
  location_region?: string;
  location_country?: string;
  location_city?: string;
  location_types?: string[];
  date_posted?: string;
  job_types?: string[];
  salary_range?: {
    min: number;
    max: number;
  };
  domains?: string[];
  experience_levels?: number[];
  management_levels?: number[];
  ids?: string[]; // For specific job IDs
}
```

#### Response Success (200)
```json
{
  "jobs": [
    {
      "id": "job-uuid",
      "job_number": 12345,
      "title": "Senior Software Engineer",
      "about": "Job description...",
      "experience_level": 4,
      "management_level": 2,
      "job_type": "full_time",
      "location_type": "remote",
      "location_value": "Remote",
      "salary_from_cents": 8000000,
      "salary_to_cents": 12000000,
      "salary_currency": "USD",
      "referral_cents": 500000,
      "referral_currency": "USD",
      "status": "published",
      "posted_date": "2024-01-15T10:00:00Z",
      "expired_date": "2024-04-15T10:00:00Z",
      "organization": {
        "id": "org-uuid",
        "name": "Tech Company",
        "logo": "logo-url"
      },
      "speciality": {
        "id": "spec-uuid",
        "name": "Software Development"
      },
      "skills": [
        {
          "id": "skill-uuid",
          "name": "JavaScript"
        }
      ]
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 100,
    "per_page": 10
  }
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Get()
async getJobs(@Query() query: JobIndexQuery) {
  return this.jobService.getJobs(query);
}

// job.service.ts
async getJobs(query: JobIndexQuery) {
  const { page = 1, perPage = 10, ...filters } = query;
  
  const jobsQuery = this.jobRepository.createQueryBuilder('job')
    .leftJoinAndSelect('job.organization', 'organization')
    .leftJoinAndSelect('job.speciality', 'speciality')
    .leftJoinAndSelect('job.skills', 'skills')
    .leftJoinAndSelect('job.city', 'city')
    .leftJoinAndSelect('job.country', 'country')
    .leftJoinAndSelect('job.region', 'region');

  // Apply filters
  if (filters.query) {
    jobsQuery.andWhere(
      '(job.title ILIKE :query OR job.about ILIKE :query OR organization.name ILIKE :query)',
      { query: `%${filters.query}%` }
    );
  }

  if (filters.location_city) {
    jobsQuery.andWhere('city.id = :cityId', { cityId: filters.location_city });
  }

  if (filters.experience_levels?.length) {
    jobsQuery.andWhere('job.experience_level IN (:...levels)', { 
      levels: filters.experience_levels 
    });
  }

  if (filters.job_types?.length) {
    jobsQuery.andWhere('job.job_type IN (:...types)', { 
      types: filters.job_types 
    });
  }

  if (filters.salary_range) {
    jobsQuery.andWhere(
      'job.salary_from_cents >= :minSalary AND job.salary_to_cents <= :maxSalary',
      { 
        minSalary: filters.salary_range.min * 100,
        maxSalary: filters.salary_range.max * 100
      }
    );
  }

  // Only published jobs
  jobsQuery.andWhere('job.status = :status', { status: 'published' });

  // Partner host filter
  if (filters.partner_host) {
    jobsQuery.andWhere('job.partner_host_id = :partnerHostId', { 
      partnerHostId: filters.partner_host 
    });
  }

  const [jobs, total] = await jobsQuery
    .skip((page - 1) * perPage)
    .take(perPage)
    .getManyAndCount();

  return {
    jobs,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(total / perPage),
      total_count: total,
      per_page: perPage
    }
  };
}
```

### 2. Get Job by ID

#### Endpoint: `GET /api/v1/jobs/:id`

#### Response Success (200)
```json
{
  "job": {
    "id": "job-uuid",
    "job_number": 12345,
    "title": "Senior Software Engineer",
    "about": "Detailed job description...",
    "responsibilities": "Job responsibilities...",
    "minimum_qualifications": "Required qualifications...",
    "preferred_requirement": "Preferred qualifications...",
    "benefits": "Job benefits...",
    "experience_level": 4,
    "management_level": 2,
    "job_type": "full_time",
    "location_type": "remote",
    "location_value": "Remote",
    "salary_from_cents": 8000000,
    "salary_to_cents": 12000000,
    "salary_currency": "USD",
    "salary_type": "annual",
    "referral_cents": 500000,
    "referral_currency": "USD",
    "referral_type": "fixed",
    "referral_info": {
      "conditions": "Referral conditions..."
    },
    "status": "published",
    "posted_date": "2024-01-15T10:00:00Z",
    "expired_date": "2024-04-15T10:00:00Z",
    "direct_manager": "John Doe",
    "direct_manager_title": "Engineering Manager",
    "direct_manager_profile": "Manager profile...",
    "direct_manager_logo": "logo-url",
    "english_level": "fluent",
    "apply_method": "email",
    "apply_target": "careers@company.com",
    "organization": {
      "id": "org-uuid",
      "name": "Tech Company",
      "about": "Company description...",
      "website": "https://company.com",
      "logo": "logo-url"
    },
    "speciality": {
      "id": "spec-uuid",
      "name": "Software Development"
    },
    "skills": [
      {
        "id": "skill-uuid",
        "name": "JavaScript"
      }
    ],
    "city": {
      "id": "city-uuid",
      "name": "San Francisco"
    },
    "country": {
      "id": "country-uuid",
      "name": "United States"
    },
    "region": {
      "id": "region-uuid",
      "name": "North America"
    },
    "job_apply": {
      "id": "apply-uuid",
      "status": "new",
      "created_at": "2024-01-20T10:00:00Z"
    }
  }
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Get(':id')
async getJob(@Param('id') id: string, @CurrentUser() user?: User) {
  return this.jobService.getJob(id, user?.id);
}

// job.service.ts
async getJob(id: string, userId?: string) {
  const job = await this.jobRepository.findOne({
    where: { id, status: 'published' },
    relations: [
      'organization',
      'speciality', 
      'skills',
      'city',
      'country',
      'region',
      'partnerHost'
    ]
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  let jobApply = null;
  if (userId) {
    const talent = await this.talentService.findByUserId(userId);
    if (talent) {
      jobApply = await this.jobApplyRepository.findOne({
        where: { jobId: id, talentId: talent.id }
      });
    }
  }

  return {
    job: {
      ...job,
      job_apply: jobApply
    }
  };
}
```

### 3. Get Similar Jobs

#### Endpoint: `GET /api/v1/jobs/:id/similar_jobs`

#### Query Parameters
```typescript
interface SimilarJobsQuery {
  page?: number;
  per_page?: number;
}
```

#### Response Success (200)
```json
{
  "jobs": [
    {
      "id": "similar-job-uuid",
      "title": "Similar Job Title",
      "organization": {
        "name": "Similar Company"
      },
      "similarity_score": 0.85
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 50
  }
}
```

---

## 📝 Job Creation & Management

### 1. Create Job

#### Endpoint: `POST /api/v1/jobs`

#### Request Body
```json
{
  "job": {
    "title": "Senior Software Engineer",
    "experience_level": 4,
    "management_level": 2,
    "job_type": "full_time",
    "about": "Job description...",
    "responsibilities": "Job responsibilities...",
    "minimum_qualifications": "Required qualifications...",
    "preferred_requirement": "Preferred qualifications...",
    "benefits": "Job benefits...",
    "direct_manager": "John Doe",
    "direct_manager_title": "Engineering Manager",
    "direct_manager_profile": "Manager profile...",
    "english_level": "fluent",
    "specialty": {
      "id": "spec-uuid"
    },
    "organization": {
      "name": "Tech Company",
      "industry_id": "industry-uuid",
      "about": "Company description...",
      "website": "https://company.com",
      "github": "https://github.com/company",
      "linkedin": "https://linkedin.com/company",
      "twitter": "https://twitter.com/company"
    },
    "skills": [
      {
        "id": "skill-uuid"
      }
    ],
    "apply": {
      "method": "email",
      "target": "careers@company.com"
    },
    "location": {
      "type": "remote",
      "value": "Remote",
      "region": {
        "id": "region-uuid"
      },
      "city": {
        "id": "city-uuid"
      },
      "country": {
        "id": "country-uuid"
      }
    },
    "referral": {
      "amount": 5000,
      "currency": "USD"
    },
    "salary": {
      "type": "annual",
      "from": 80000,
      "to": 120000,
      "currency": "USD"
    }
  }
}
```

#### Response Success (201)
```json
{
  "data": {
    "job_id": "job-uuid",
    "org_id": "org-uuid",
    "job_status": "pending_to_review",
    "job_number": 12345
  },
  "is_success": true,
  "errors": []
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Post()
@UseGuards(JwtAuthGuard)
async createJob(@Body() createJobDto: CreateJobDto, @CurrentUser() user: User) {
  return this.jobService.createJob(createJobDto, user.id);
}

// job.service.ts
async createJob(createJobDto: CreateJobDto, userId: string) {
  // 1. Validate job data
  await this.validateJobData(createJobDto);

  // 2. Create or update organization
  const organization = await this.createOrUpdateOrganization(createJobDto.organization);

  // 3. Create job
  const job = await this.jobRepository.create({
    ...createJobDto,
    organizationId: organization.id,
    createdBy: userId,
    updatedBy: userId,
    status: 'pending_to_review',
    postedDate: new Date(),
    expiredDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    jobNumber: await this.generateJobNumber()
  });

  // 4. Associate skills
  if (createJobDto.skills?.length) {
    const skills = await this.skillService.findByIds(createJobDto.skills.map(s => s.id));
    job.skills = skills;
  }

  // 5. Set partner host
  job.partnerHost = await this.getCurrentPartnerHost();

  const savedJob = await this.jobRepository.save(job);

  return {
    data: {
      job_id: savedJob.id,
      org_id: organization.id,
      job_status: savedJob.status,
      job_number: savedJob.jobNumber
    },
    is_success: true,
    errors: []
  };
}

private async generateJobNumber(): Promise<number> {
  const lastJob = await this.jobRepository.findOne({
    order: { jobNumber: 'DESC' }
  });
  
  return lastJob ? lastJob.jobNumber + 1 : 1;
}
```

### 2. Close Job

#### Endpoint: `PATCH /api/v1/jobs/:id/closed_job`

#### Request Body
```json
{
  "job": {
    "close_type": "hired",
    "job_closure_reasons_attributes": [
      {
        "other_reason": "Custom reason",
        "choice_options": ["option1", "option2"]
      }
    ]
  }
}
```

#### Response Success (200)
```json
{
  "message": "Job closed successfully"
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Patch(':id/closed_job')
@UseGuards(JwtAuthGuard)
async closeJob(
  @Param('id') id: string,
  @Body() closeJobDto: CloseJobDto,
  @CurrentUser() user: User
) {
  return this.jobService.closeJob(id, closeJobDto, user.id);
}

// job.service.ts
async closeJob(id: string, closeJobDto: CloseJobDto, userId: string) {
  const job = await this.jobRepository.findOne({
    where: { id, createdBy: userId }
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  if (job.createdBy !== userId) {
    throw new UnauthorizedException('Only job creator can close job');
  }

  if (Job.FINISHED_STATUS.includes(job.status)) {
    throw new BadRequestException('Job has been closed or completed');
  }

  // Update job status
  job.status = closeJobDto.close_type;
  job.updatedBy = userId;

  // Create closure reasons
  if (closeJobDto.job_closure_reasons_attributes?.length) {
    const closureReasons = closeJobDto.job_closure_reasons_attributes.map(reason => 
      this.jobClosureReasonRepository.create({
        jobId: job.id,
        otherReason: reason.other_reason,
        choiceOptions: reason.choice_options
      })
    );
    await this.jobClosureReasonRepository.save(closureReasons);
  }

  await this.jobRepository.save(job);

  return { message: 'Job closed successfully' };
}
```

---

## 📋 Job Application

### 1. Apply for Job

#### Endpoint: `POST /api/v1/jobs/:id/apply`

#### Request Body
```json
{
  "uploaded_resume_id": "resume-uuid",
  "resume_file": "file",
  "email": "candidate@example.com",
  "phone_number": "+1234567890",
  "headline": "Senior Software Engineer",
  "web3_wallet_address": "0x123...",
  "web3_chain_name": "ethereum"
}
```

#### Response Success (200)
```json
{
  "job_apply": {
    "id": "apply-uuid",
    "status": "new",
    "created_at": "2024-01-20T10:00:00Z"
  },
  "uploaded_resume": {
    "id": "resume-uuid",
    "filename": "resume.pdf"
  },
  "web3_wallet_address": "0x123..."
}
```

#### Response Error (400)
```json
{
  "errors": "Resume is required"
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Post(':id/apply')
@UseGuards(JwtAuthGuard)
async applyForJob(
  @Param('id') id: string,
  @Body() applyJobDto: ApplyJobDto,
  @CurrentUser() user: User,
  @UploadedFile() resumeFile?: Express.Multer.File
) {
  return this.jobService.applyForJob(id, applyJobDto, user, resumeFile);
}

// job.service.ts
async applyForJob(
  jobId: string, 
  applyJobDto: ApplyJobDto, 
  user: User, 
  resumeFile?: Express.Multer.File
) {
  // 1. Validate job
  const job = await this.jobRepository.findOne({
    where: { id: jobId, status: 'published' }
  });

  if (!job) {
    throw new NotFoundException('Job not found or not published');
  }

  // 2. Get or create talent profile
  let talent = await this.talentService.findByUserId(user.id);
  if (!talent) {
    talent = await this.talentService.create({
      userId: user.id,
      status: 'new_profile'
    });
  }

  // 3. Validate resume
  let uploadedResume: UploadedResume;
  if (applyJobDto.uploaded_resume_id) {
    uploadedResume = await this.resumeService.findById(applyJobDto.uploaded_resume_id);
    if (uploadedResume.talentId !== talent.id) {
      throw new BadRequestException('Invalid resume');
    }
  } else if (resumeFile) {
    uploadedResume = await this.resumeService.uploadResume(talent.id, resumeFile);
  } else {
    throw new BadRequestException('Resume is required');
  }

  // 4. Check if already applied
  const existingApply = await this.jobApplyRepository.findOne({
    where: { jobId, talentId: talent.id }
  });

  if (existingApply) {
    throw new ConflictException('Already applied for this job');
  }

  // 5. Create job application
  const jobApply = await this.jobApplyRepository.create({
    jobId,
    talentId: talent.id,
    uploadedResumeId: uploadedResume.id,
    status: 'new',
    email: applyJobDto.email || user.email,
    phoneNumber: applyJobDto.phone_number,
    headline: applyJobDto.headline
  });

  await this.jobApplyRepository.save(jobApply);

  // 6. Update wallet address if provided
  if (applyJobDto.web3_wallet_address && applyJobDto.web3_chain_name) {
    await this.walletService.addWalletAddress(talent.id, {
      address: applyJobDto.web3_wallet_address,
      chainName: applyJobDto.web3_chain_name
    });
  }

  // 7. Send background job for email notification
  await this.jobApplyProcessor.add('send-application-email', {
    jobApplyId: jobApply.id
  });

  return {
    job_apply: {
      id: jobApply.id,
      status: jobApply.status,
      created_at: jobApply.createdAt
    },
    uploaded_resume: {
      id: uploadedResume.id,
      filename: uploadedResume.filename
    },
    web3_wallet_address: applyJobDto.web3_wallet_address
  };
}
```

### 2. Get Job Applications

#### Endpoint: `GET /api/v1/job_applies`

#### Query Parameters
```typescript
interface JobAppliesQuery {
  status?: string;
  job_status?: string;
  job_not_status?: string;
  page?: number;
  page_size?: number;
}
```

#### Response Success (200)
```json
{
  "job_applies": [
    {
      "id": "apply-uuid",
      "status": "new",
      "created_at": "2024-01-20T10:00:00Z",
      "job": {
        "id": "job-uuid",
        "title": "Senior Software Engineer",
        "organization": {
          "name": "Tech Company"
        }
      },
      "talent": {
        "id": "talent-uuid",
        "headline": "Senior Software Engineer"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 50
  }
}
```

### 3. Update Job Application Status

#### Endpoint: `PATCH /api/v1/job_applies/:id/update_status`

#### Request Body
```json
{
  "job_apply": {
    "status": "under_review",
    "rejected_note": "Not a good fit"
  }
}
```

#### Response Success (200)
```json
{
  "message": "Updated success!"
}
```

---

## 🔗 Job Referral System

### 1. Generate Referral Link

#### Endpoint: `GET /api/v1/jobs/:id/referral_link`

#### Response Success (200)
```json
{
  "link_token": "referral-link-uuid"
}
```

#### NestJS Implementation

```typescript
// job.controller.ts
@Get(':id/referral_link')
@UseGuards(JwtAuthGuard)
async generateReferralLink(
  @Param('id') id: string,
  @CurrentUser() user: User
) {
  return this.jobService.generateReferralLink(id, user.id);
}

// job.service.ts
async generateReferralLink(jobId: string, userId: string) {
  // 1. Find job
  const job = await this.jobRepository.findOne({
    where: { id: jobId, status: 'published' }
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // 2. Find or create referral link
  let referralLink = await this.referralLinkRepository.findOne({
    where: { jobId, referrerId: userId }
  });

  if (!referralLink) {
    referralLink = await this.referralLinkRepository.create({
      jobId,
      referrerId: userId
    });
    await this.referralLinkRepository.save(referralLink);
  }

  return { link_token: referralLink.id };
}
```

### 2. Get Job by Referral Link

#### Endpoint: `GET /api/v1/job_referrals/:id`

#### Response Success (200)
```json
{
  "id": "referral-link-uuid",
  "job_id": "job-uuid",
  "job_title": "Senior Software Engineer"
}
```

### 3. Refer Candidate

#### Endpoint: `POST /api/v1/jobs/:id/referral_candidate`

#### Request Body
```json
{
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "candidate_phonenumber": "+1234567890",
  "candidate_introduction": "Great candidate...",
  "candidate_resume": "file",
  "recommendation": "Highly recommended...",
  "web3_wallet_address": "0x123...",
  "web3_signature": "signature",
  "web3_chain_name": "ethereum"
}
```

#### Response Success (200)
```json
{
  "id": "referral-uuid",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "status": "pending",
  "created_at": "2024-01-20T10:00:00Z"
}
```

### 4. Apply via Referral

#### Endpoint: `POST /api/v1/jobs/:id/referral_apply`

#### Request Body
```json
{
  "job_referral_id": "referral-uuid"
}
```

#### Response Success (200)
```json
{
  "id": "apply-uuid",
  "status": "new",
  "job_referral_id": "referral-uuid",
  "created_at": "2024-01-20T10:00:00Z"
}
```

---

## 💰 Payment & Transaction Management

### 1. Update Transaction Details

#### Endpoint: `PATCH /api/v1/jobs/:id/update_transaction_details`

#### Request Body
```json
{
  "job": {
    "referral": 5000,
    "referral_currency": "USD",
    "address_token": "0x123...",
    "chain_id": "ethereum"
  }
}
```

#### Response Success (200)
```json
{
  "job": {
    "id": "job-uuid",
    "referral_cents": 500000,
    "referral_currency": "USD",
    "address_token": "0x123...",
    "chain_id": "ethereum"
  }
}
```

### 2. Update Referral Info

#### Endpoint: `PATCH /api/v1/jobs/:id/update_referral_info`

#### Request Body
```json
{
  "job": {
    "referral_type": "percentage",
    "referral_info": {
      "percentage": 10,
      "conditions": "Must be hired within 90 days"
    }
  }
}
```

#### Response Success (200)
```json
{
  "data": "success!"
}
```

---

## 🔧 Services Implementation

### 1. Job Service

```typescript
// job.service.ts
@Injectable()
export class JobService {
  constructor(
    private jobRepository: JobRepository,
    private jobApplyRepository: JobApplyRepository,
    private jobReferralRepository: JobReferralRepository,
    private referralLinkRepository: ReferralLinkRepository,
    private organizationService: OrganizationService,
    private skillService: SkillService,
    private talentService: TalentService,
    private resumeService: ResumeService,
    private walletService: WalletService,
    private jobApplyProcessor: JobApplyProcessor
  ) {}

  async getJobs(query: JobIndexQuery) {
    // Implementation
  }

  async getJob(id: string, userId?: string) {
    // Implementation
  }

  async createJob(createJobDto: CreateJobDto, userId: string) {
    // Implementation
  }

  async closeJob(id: string, closeJobDto: CloseJobDto, userId: string) {
    // Implementation
  }

  async applyForJob(jobId: string, applyJobDto: ApplyJobDto, user: User, resumeFile?: Express.Multer.File) {
    // Implementation
  }

  async generateReferralLink(jobId: string, userId: string) {
    // Implementation
  }

  async referCandidate(jobId: string, referCandidateDto: ReferCandidateDto, user: User) {
    // Implementation
  }

  async applyViaReferral(jobId: string, referralId: string) {
    // Implementation
  }

  async updateTransactionDetails(id: string, transactionDto: UpdateTransactionDto, userId: string) {
    // Implementation
  }

  async updateReferralInfo(id: string, referralInfoDto: UpdateReferralInfoDto, userId: string) {
    // Implementation
  }
}
```

### 2. Job Apply Service

```typescript
// job-apply.service.ts
@Injectable()
export class JobApplyService {
  constructor(
    private jobApplyRepository: JobApplyRepository,
    private jobRepository: JobRepository,
    private talentService: TalentService
  ) {}

  async getJobApplies(query: JobAppliesQuery, userId: string) {
    // Implementation
  }

  async updateJobApplyStatus(id: string, updateDto: UpdateJobApplyDto, userId: string) {
    // Implementation
  }
}
```

### 3. Job Referral Service

```typescript
// job-referral.service.ts
@Injectable()
export class JobReferralService {
  constructor(
    private jobReferralRepository: JobReferralRepository,
    private referralLinkRepository: ReferralLinkRepository,
    private userService: UserService,
    private talentService: TalentService,
    private emailService: EmailService
  ) {}

  async getJobReferrals(query: JobReferralsQuery, userId: string) {
    // Implementation
  }

  async createReferral(createReferralDto: CreateReferralDto, userId: string) {
    // Implementation
  }
}
```

---

## 📝 DTOs

### 1. Create Job DTO

```typescript
// create-job.dto.ts
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  experience_level: number;

  @IsNumber()
  management_level: number;

  @IsString()
  job_type: string;

  @IsString()
  about: string;

  @IsString()
  responsibilities: string;

  @IsString()
  minimum_qualifications: string;

  @IsString()
  preferred_requirement: string;

  @IsString()
  benefits: string;

  @IsString()
  @IsOptional()
  direct_manager?: string;

  @IsString()
  @IsOptional()
  direct_manager_title?: string;

  @IsString()
  @IsOptional()
  direct_manager_profile?: string;

  @IsString()
  english_level: string;

  @ValidateNested()
  @Type(() => SpecialtyDto)
  specialty: SpecialtyDto;

  @ValidateNested()
  @Type(() => OrganizationDto)
  organization: OrganizationDto;

  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills: SkillDto[];

  @ValidateNested()
  @Type(() => ApplyDto)
  apply: ApplyDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => ReferralDto)
  @IsOptional()
  referral?: ReferralDto;

  @ValidateNested()
  @Type(() => SalaryDto)
  @IsOptional()
  salary?: SalaryDto;
}
```

### 2. Apply Job DTO

```typescript
// apply-job.dto.ts
export class ApplyJobDto {
  @IsUUID()
  @IsOptional()
  uploaded_resume_id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  web3_wallet_address?: string;

  @IsString()
  @IsOptional()
  web3_chain_name?: string;
}
```

### 3. Refer Candidate DTO

```typescript
// refer-candidate.dto.ts
export class ReferCandidateDto {
  @IsString()
  candidate_name: string;

  @IsEmail()
  candidate_email: string;

  @IsString()
  @IsOptional()
  candidate_phonenumber?: string;

  @IsString()
  @IsOptional()
  candidate_introduction?: string;

  @IsString()
  @IsOptional()
  recommendation?: string;

  @IsString()
  @IsOptional()
  web3_wallet_address?: string;

  @IsString()
  @IsOptional()
  web3_signature?: string;

  @IsString()
  @IsOptional()
  web3_chain_name?: string;
}
```

---

## 🧪 Testing

### 1. Job Controller Test

```typescript
// job.controller.spec.ts
describe('JobController', () => {
  let controller: JobController;
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: {
            getJobs: jest.fn(),
            getJob: jest.fn(),
            createJob: jest.fn(),
            closeJob: jest.fn(),
            applyForJob: jest.fn(),
            generateReferralLink: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<JobController>(JobController);
    service = module.get<JobService>(JobService);
  });

  it('should get jobs', async () => {
    const query = { page: 1, per_page: 10 };
    const expectedResult = { jobs: [], pagination: {} };

    jest.spyOn(service, 'getJobs').mockResolvedValue(expectedResult);

    const result = await controller.getJobs(query);

    expect(result).toBe(expectedResult);
    expect(service.getJobs).toHaveBeenCalledWith(query);
  });

  it('should create job', async () => {
    const createJobDto = { title: 'Test Job' };
    const user = { id: 'user-uuid' };
    const expectedResult = { data: { job_id: 'job-uuid' } };

    jest.spyOn(service, 'createJob').mockResolvedValue(expectedResult);

    const result = await controller.createJob(createJobDto, user);

    expect(result).toBe(expectedResult);
    expect(service.createJob).toHaveBeenCalledWith(createJobDto, user.id);
  });
});
```

---

## 📋 Checklist

- [ ] Job Listing & Search
- [ ] Job Creation
- [ ] Job Management (Close, Update)
- [ ] Job Application
- [ ] Job Referral System
- [ ] Payment & Transaction Management
- [ ] Background Jobs
- [ ] Email Notifications
- [ ] Web3 Integration
- [ ] File Upload (Resume)
- [ ] Validation & Authorization
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] API Documentation

---

**🎉 Ready for implementation!** 