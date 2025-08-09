# Talent Domain Endpoints & Logic Documentation

## 📋 Tổng quan

Document này mô tả chi tiết các endpoint và business logic liên quan đến domain Talent trong hệ thống UC Talent.

## 🏗️ Talent Domain Architecture

### Core Entities

- **Talent**: Profile chính của talent
- **Experience**: Kinh nghiệm làm việc
- **Education**: Học vấn
- **ExternalLink**: Links bên ngoài (LinkedIn, GitHub, etc.)
- **UploadedResume**: Resume đã upload
- **RecommendationJob**: Job recommendations

### Supporting Entities

- **User**: User account liên kết
- **Speciality**: Chuyên môn
- **Skill**: Kỹ năng
- **Role**: Vai trò công việc
- **Organization**: Công ty/trường học
- **City**: Địa điểm

---

## 👤 Talent Profile Management

### 1. Get All Talents

#### Endpoint: `GET /api/v1/talents`

#### Response Success (200)

```json
{
  "talents": [
    {
      "id": "talent-uuid",
      "headline": "Senior Software Engineer",
      "about": "Experienced developer...",
      "employment_status": "available_now",
      "experience_level": 4,
      "management_level": 2,
      "english_proficiency": "fluent",
      "status": "active",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "specialities": [
        {
          "id": "spec-uuid",
          "name": "Software Development"
        }
      ],
      "skills": [
        {
          "id": "skill-uuid",
          "name": "JavaScript"
        }
      ]
    }
  ]
}
```

#### NestJS Implementation

```typescript
// talent.controller.ts
@Get()
async getTalents() {
  return this.talentService.getTalents();
}

// talent.service.ts
async getTalents() {
  const talents = await this.talentRepository.find({
    relations: [
      'user',
      'specialities',
      'skills',
      'roles',
      'experiences',
      'educations'
    ]
  });

  return { talents };
}
```

### 2. Get My Talent Profile

#### Endpoint: `GET /api/v1/talents/me`

#### Response Success (200)

```json
{
  "talent": {
    "id": "talent-uuid",
    "headline": "Senior Software Engineer",
    "about": "Experienced developer with 5+ years...",
    "employment_status": "available_now",
    "experience_level": 4,
    "management_level": 2,
    "english_proficiency": "fluent",
    "status": "active",
    "step": 8,
    "job_recommendation_frequency": "weekly",
    "last_recommendation_sent": "2024-01-15T10:00:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "location_city": {
        "id": "city-uuid",
        "name": "San Francisco"
      }
    },
    "specialities": [
      {
        "id": "spec-uuid",
        "name": "Software Development"
      }
    ],
    "skills": [
      {
        "id": "skill-uuid",
        "name": "JavaScript"
      }
    ],
    "roles": [
      {
        "id": "role-uuid",
        "name": "Backend Developer"
      }
    ],
    "experiences": [
      {
        "id": "exp-uuid",
        "title": "Senior Software Engineer",
        "company_name": "Tech Company",
        "organization": {
          "id": "org-uuid",
          "name": "Tech Company"
        },
        "job_type": "full_time",
        "is_currently_working": true,
        "start_time": "2022-01-01T00:00:00Z",
        "end_time": null,
        "job_description": "Led development team..."
      }
    ],
    "educations": [
      {
        "id": "edu-uuid",
        "school_name": "University of Technology",
        "organization": {
          "id": "org-uuid",
          "name": "University of Technology"
        },
        "degree": "Bachelor of Computer Science",
        "start_time": "2018-09-01T00:00:00Z",
        "end_time": "2022-05-01T00:00:00Z",
        "description": "Computer Science major..."
      }
    ],
    "external_links": [
      {
        "id": "link-uuid",
        "platform": "linkedin",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "id": "link-uuid",
        "platform": "github",
        "url": "https://github.com/johndoe"
      }
    ],
    "uploaded_resumes": [
      {
        "id": "resume-uuid",
        "filename": "john_doe_resume.pdf",
        "status": "active",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### Response Error (404)

```json
{
  "error": "You have not yet created a talent profile. Please create one."
}
```

#### NestJS Implementation

```typescript
// talent.controller.ts
@Get('me')
@UseGuards(JwtAuthGuard)
async getMyTalent(@CurrentUser() user: User) {
  return this.talentService.getMyTalent(user.id);
}

// talent.service.ts
async getMyTalent(userId: string) {
  const talent = await this.talentRepository.findOne({
    where: { userId },
    relations: [
      'user',
      'user.locationCity',
      'specialities',
      'skills',
      'roles',
      'experiences',
      'experiences.organization',
      'educations',
      'educations.organization',
      'externalLinks',
      'uploadedResumes'
    ]
  });

  if (!talent) {
    throw new NotFoundException('You have not yet created a talent profile. Please create one.');
  }

  return { talent };
}
```

### 3. Create/Update Talent Profile (Onboarding)

#### Endpoint: `POST /api/v1/talents`

#### Request Body

```json
{
  "talent": {
    "name": "John Doe",
    "location_city_id": "city-uuid",
    "employment_status": "available_now",
    "experience_level": 4,
    "management_level": 2,
    "status": "new_profile",
    "headline": "Senior Software Engineer",
    "about": "Experienced developer with 5+ years...",
    "english_proficiency": "fluent",
    "phone_number_country": "US",
    "phone_number": "+1234567890",
    "step": 8,
    "specialities": ["spec-uuid"],
    "skills": ["skill-uuid"],
    "roles": ["role-uuid"],
    "links": [
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "platform": "github",
        "url": "https://github.com/johndoe"
      }
    ],
    "work_experiences": [
      {
        "id": "exp-uuid",
        "title": "Senior Software Engineer",
        "company_name": "Tech Company",
        "organization_id": "org-uuid",
        "job_type": "full_time",
        "is_currently_working": true,
        "start_time": "2022-01-01T00:00:00Z",
        "end_time": null,
        "job_description": "Led development team..."
      }
    ],
    "educations": [
      {
        "id": "edu-uuid",
        "school_name": "University of Technology",
        "organization_id": "org-uuid",
        "start_time": "2018-09-01T00:00:00Z",
        "end_time": "2022-05-01T00:00:00Z",
        "degree": "Bachelor of Computer Science",
        "description": "Computer Science major..."
      }
    ]
  }
}
```

#### Response Success (201)

```json
{
  "talent": {
    "id": "talent-uuid",
    "headline": "Senior Software Engineer",
    "status": "new_profile",
    "step": 8,
    "user": {
      "id": "user-uuid",
      "name": "John Doe"
    }
  }
}
```

#### Response Error (422)

```json
{
  "error": "Validation failed"
}
```

#### NestJS Implementation

```typescript
// talent.controller.ts
@Post()
@UseGuards(JwtAuthGuard)
async createTalent(@Body() createTalentDto: CreateTalentDto, @CurrentUser() user: User) {
  return this.talentService.createOrUpdateTalent(createTalentDto, user.id);
}

// talent.service.ts
async createOrUpdateTalent(createTalentDto: CreateTalentDto, userId: string) {
  // 1. Find or create talent
  let talent = await this.talentRepository.findOne({
    where: { userId }
  });

  if (!talent) {
    talent = this.talentRepository.create({
      userId,
      status: 'new_profile',
      step: 0
    });
  }

  // 2. Update step if provided
  if (createTalentDto.step && createTalentDto.step > talent.step) {
    talent.step = createTalentDto.step;
  }

  // 3. Update basic attributes
  if (createTalentDto.employment_status) {
    talent.employmentStatus = createTalentDto.employment_status;
  }

  if (createTalentDto.english_proficiency) {
    talent.englishProficiency = createTalentDto.english_proficiency;
  }

  if (createTalentDto.management_level) {
    talent.managementLevel = createTalentDto.management_level;
  }

  if (createTalentDto.experience_level) {
    talent.experienceLevel = createTalentDto.experience_level;
  }

  if (createTalentDto.headline) {
    talent.headline = createTalentDto.headline;
  }

  if (createTalentDto.about) {
    talent.about = createTalentDto.about;
  }

  // 4. Update user information
  const user = await this.userService.findById(userId);
  if (createTalentDto.name) {
    user.name = createTalentDto.name;
  }

  if (createTalentDto.location_city_id) {
    user.locationCityId = createTalentDto.location_city_id;
  }

  if (createTalentDto.phone_number) {
    const phone = this.parsePhoneNumber(createTalentDto.phone_number);
    user.phoneNumber = phone.fullE164;
    user.phoneNumberCountry = createTalentDto.phone_number_country;
  }

  await this.userService.update(userId, user);

  // 5. Update associations
  if (createTalentDto.specialities?.length) {
    const specialities = await this.specialityService.findByIds(createTalentDto.specialities);
    talent.specialities = specialities;
  }

  if (createTalentDto.skills?.length) {
    const skills = await this.skillService.findByIds(createTalentDto.skills);
    talent.skills = skills;
  }

  if (createTalentDto.roles?.length) {
    const roles = await this.roleService.findByIds(createTalentDto.roles);
    talent.roles = roles;
  }

  // 6. Update work experiences
  if (createTalentDto.work_experiences?.length) {
    await this.updateWorkExperiences(talent.id, createTalentDto.work_experiences);
  }

  // 7. Update educations
  if (createTalentDto.educations?.length) {
    await this.updateEducations(talent.id, createTalentDto.educations);
  }

  // 8. Update external links
  if (createTalentDto.links?.length) {
    await this.updateExternalLinks(talent.id, createTalentDto.links);
  }

  // 9. Save talent
  await this.talentRepository.save(talent);

  // 10. Publish event
  if (createTalentDto.step) {
    await this.eventService.publish('talent-onboarding', {
      userId,
      step: createTalentDto.step
    });
  }

  return {
    talent: {
      id: talent.id,
      headline: talent.headline,
      status: talent.status,
      step: talent.step,
      user: {
        id: user.id,
        name: user.name
      }
    }
  };
}

private async updateWorkExperiences(talentId: string, experiences: any[]) {
  for (const exp of experiences) {
    // Find or create organization
    let organization = null;
    if (exp.organization_id) {
      organization = await this.organizationService.findById(exp.organization_id);
    } else if (exp.company_name) {
      organization = await this.organizationService.findOrCreateByName(exp.company_name);
    }

    // Find or create experience
    let experience = null;
    if (exp.id) {
      experience = await this.experienceService.findById(exp.id);
      if (experience && experience.talentId !== talentId) {
        throw new BadRequestException('Invalid experience ID');
      }
    }

    if (!experience) {
      experience = this.experienceService.create({
        talentId,
        organizationId: organization?.id,
        title: exp.title,
        jobType: exp.job_type,
        isCurrentlyWorking: exp.is_currently_working,
        startTime: new Date(exp.start_time),
        endTime: exp.end_time ? new Date(exp.end_time) : null,
        jobDescription: exp.job_description
      });
    } else {
      Object.assign(experience, {
        organizationId: organization?.id,
        title: exp.title,
        jobType: exp.job_type,
        isCurrentlyWorking: exp.is_currently_working,
        startTime: new Date(exp.start_time),
        endTime: exp.end_time ? new Date(exp.end_time) : null,
        jobDescription: exp.job_description
      });
    }

    await this.experienceService.save(experience);
  }
}

private async updateEducations(talentId: string, educations: any[]) {
  for (const edu of educations) {
    // Find or create organization
    let organization = null;
    if (edu.organization_id) {
      organization = await this.organizationService.findById(edu.organization_id);
    } else if (edu.school_name) {
      organization = await this.organizationService.findOrCreateByName(edu.school_name);
    }

    // Find or create education
    let education = null;
    if (edu.id) {
      education = await this.educationService.findById(edu.id);
      if (education && education.talentId !== talentId) {
        throw new BadRequestException('Invalid education ID');
      }
    }

    if (!education) {
      education = this.educationService.create({
        talentId,
        organizationId: organization?.id,
        degree: edu.degree,
        startTime: new Date(edu.start_time),
        endTime: edu.end_time ? new Date(edu.end_time) : null,
        description: edu.description
      });
    } else {
      Object.assign(education, {
        organizationId: organization?.id,
        degree: edu.degree,
        startTime: new Date(edu.start_time),
        endTime: edu.end_time ? new Date(edu.end_time) : null,
        description: edu.description
      });
    }

    await this.educationService.save(education);
  }
}

private async updateExternalLinks(talentId: string, links: any[]) {
  for (const link of links) {
    let externalLink = await this.externalLinkService.findByTalentAndPlatform(
      talentId,
      link.platform
    );

    if (!externalLink) {
      externalLink = this.externalLinkService.create({
        talentId,
        platform: link.platform,
        url: link.url
      });
    } else {
      externalLink.url = link.url;
    }

    await this.externalLinkService.save(externalLink);
  }
}
```

### 4. Submit Talent Profile for Review

#### Endpoint: `PATCH /api/v1/talents/me/submit`

#### Response Success (200)

```json
{
  "message": "Profile submitted for review successfully"
}
```

#### NestJS Implementation

```typescript
// talent.controller.ts
@Patch('me/submit')
@UseGuards(JwtAuthGuard)
async submitTalent(@CurrentUser() user: User) {
  return this.talentService.submitTalent(user.id);
}

// talent.service.ts
async submitTalent(userId: string) {
  const talent = await this.talentRepository.findOne({
    where: { userId }
  });

  if (!talent) {
    throw new NotFoundException('Talent profile not found');
  }

  talent.status = 'under_review';
  await this.talentRepository.save(talent);

  return { message: 'Profile submitted for review successfully' };
}
```

---

## 📄 Resume Management

### 1. Get My Uploaded Resumes

#### Endpoint: `GET /api/v1/talents/me/upload_resumes`

#### Response Success (200)

```json
{
  "upload_resumes": [
    {
      "id": "resume-uuid",
      "filename": "john_doe_resume.pdf",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Response Error (404)

```json
{
  "error": "No active resumes found."
}
```

#### NestJS Implementation

```typescript
// talent.controller.ts
@Get('me/upload_resumes')
@UseGuards(JwtAuthGuard)
async getMyResumes(@CurrentUser() user: User) {
  return this.talentService.getMyResumes(user.id);
}

// talent.service.ts
async getMyResumes(userId: string) {
  const talent = await this.talentRepository.findOne({
    where: { userId }
  });

  if (!talent) {
    throw new NotFoundException('You have not yet created a talent profile. Please create one.');
  }

  const resumes = await this.uploadedResumeRepository.find({
    where: { talentId: talent.id, status: 'active' },
    order: { createdAt: 'DESC' },
    take: 5
  });

  if (resumes.length === 0) {
    throw new NotFoundException('No active resumes found.');
  }

  return { upload_resumes: resumes };
}
```

---

## 🗑️ Experience & Education Management

### 1. Delete Experience

#### Endpoint: `DELETE /api/v1/experiences/:id`

#### Response Success (200)

```json
{
  "message": "Experience deleted successfully"
}
```

#### NestJS Implementation

```typescript
// experience.controller.ts
@Delete(':id')
@UseGuards(JwtAuthGuard)
async deleteExperience(@Param('id') id: string, @CurrentUser() user: User) {
  return this.experienceService.deleteExperience(id, user.id);
}

// experience.service.ts
async deleteExperience(experienceId: string, userId: string) {
  const talent = await this.talentRepository.findOne({
    where: { userId }
  });

  if (!talent) {
    throw new NotFoundException('Talent profile not found');
  }

  const experience = await this.experienceRepository.findOne({
    where: { id: experienceId, talentId: talent.id }
  });

  if (!experience) {
    throw new NotFoundException('Experience not found');
  }

  await this.experienceRepository.remove(experience);

  return { message: 'Experience deleted successfully' };
}
```

### 2. Delete Education

#### Endpoint: `DELETE /api/v1/educations/:id`

#### Response Success (200)

```json
{
  "message": "Education deleted successfully"
}
```

#### NestJS Implementation

```typescript
// education.controller.ts
@Delete(':id')
@UseGuards(JwtAuthGuard)
async deleteEducation(@Param('id') id: string, @CurrentUser() user: User) {
  return this.educationService.deleteEducation(id, user.id);
}

// education.service.ts
async deleteEducation(educationId: string, userId: string) {
  const talent = await this.talentRepository.findOne({
    where: { userId }
  });

  if (!talent) {
    throw new NotFoundException('Talent profile not found');
  }

  const education = await this.educationRepository.findOne({
    where: { id: educationId, talentId: talent.id }
  });

  if (!education) {
    throw new NotFoundException('Education not found');
  }

  await this.educationRepository.remove(education);

  return { message: 'Education deleted successfully' };
}
```

---

## 🔧 Services Implementation

### 1. Talent Service

```typescript
// talent.service.ts
@Injectable()
export class TalentService {
  constructor(
    private talentRepository: TalentRepository,
    private userService: UserService,
    private specialityService: SpecialityService,
    private skillService: SkillService,
    private roleService: RoleService,
    private experienceService: ExperienceService,
    private educationService: EducationService,
    private externalLinkService: ExternalLinkService,
    private uploadedResumeRepository: UploadedResumeRepository,
    private eventService: EventService
  ) {}

  async getTalents() {
    // Implementation
  }

  async getMyTalent(userId: string) {
    // Implementation
  }

  async createOrUpdateTalent(createTalentDto: CreateTalentDto, userId: string) {
    // Implementation
  }

  async submitTalent(userId: string) {
    // Implementation
  }

  async getMyResumes(userId: string) {
    // Implementation
  }

  private parsePhoneNumber(phoneNumber: string) {
    // Implementation using phonelib
  }
}
```

### 2. Experience Service

```typescript
// experience.service.ts
@Injectable()
export class ExperienceService {
  constructor(
    private experienceRepository: ExperienceRepository,
    private talentRepository: TalentRepository
  ) {}

  async deleteExperience(experienceId: string, userId: string) {
    // Implementation
  }
}
```

### 3. Education Service

```typescript
// education.service.ts
@Injectable()
export class EducationService {
  constructor(
    private educationRepository: EducationRepository,
    private talentRepository: TalentRepository
  ) {}

  async deleteEducation(educationId: string, userId: string) {
    // Implementation
  }
}
```

---

## 📝 DTOs

### 1. Create Talent DTO

```typescript
// create-talent.dto.ts
export class CreateTalentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  location_city_id?: string;

  @IsString()
  @IsOptional()
  employment_status?: string;

  @IsNumber()
  @IsOptional()
  experience_level?: number;

  @IsNumber()
  @IsOptional()
  management_level?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  english_proficiency?: string;

  @IsString()
  @IsOptional()
  phone_number_country?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsNumber()
  @IsOptional()
  step?: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  specialities?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roles?: string[];

  @ValidateNested({ each: true })
  @Type(() => ExternalLinkDto)
  @IsOptional()
  links?: ExternalLinkDto[];

  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  @IsOptional()
  work_experiences?: WorkExperienceDto[];

  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @IsOptional()
  educations?: EducationDto[];
}
```

### 2. Work Experience DTO

```typescript
// work-experience.dto.ts
export class WorkExperienceDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  company_name: string;

  @IsUUID()
  @IsOptional()
  organization_id?: string;

  @IsString()
  job_type: string;

  @IsBoolean()
  is_currently_working: boolean;

  @IsDateString()
  start_time: string;

  @IsDateString()
  @IsOptional()
  end_time?: string;

  @IsString()
  @IsOptional()
  job_description?: string;
}
```

### 3. Education DTO

```typescript
// education.dto.ts
export class EducationDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  school_name: string;

  @IsUUID()
  @IsOptional()
  organization_id?: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  @IsOptional()
  end_time?: string;

  @IsString()
  @IsOptional()
  degree?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

### 4. External Link DTO

```typescript
// external-link.dto.ts
export class ExternalLinkDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;
}
```

---

## 🧪 Testing

### 1. Talent Controller Test

```typescript
// talent.controller.spec.ts
describe('TalentController', () => {
  let controller: TalentController;
  let service: TalentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalentController],
      providers: [
        {
          provide: TalentService,
          useValue: {
            getTalents: jest.fn(),
            getMyTalent: jest.fn(),
            createOrUpdateTalent: jest.fn(),
            submitTalent: jest.fn(),
            getMyResumes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TalentController>(TalentController);
    service = module.get<TalentService>(TalentService);
  });

  it('should get my talent profile', async () => {
    const user = { id: 'user-uuid' };
    const expectedResult = { talent: { id: 'talent-uuid' } };

    jest.spyOn(service, 'getMyTalent').mockResolvedValue(expectedResult);

    const result = await controller.getMyTalent(user);

    expect(result).toBe(expectedResult);
    expect(service.getMyTalent).toHaveBeenCalledWith(user.id);
  });

  it('should create talent profile', async () => {
    const createTalentDto = { headline: 'Senior Developer' };
    const user = { id: 'user-uuid' };
    const expectedResult = { talent: { id: 'talent-uuid' } };

    jest
      .spyOn(service, 'createOrUpdateTalent')
      .mockResolvedValue(expectedResult);

    const result = await controller.createTalent(createTalentDto, user);

    expect(result).toBe(expectedResult);
    expect(service.createOrUpdateTalent).toHaveBeenCalledWith(
      createTalentDto,
      user.id
    );
  });
});
```

---

## 📋 Checklist

- [ ] Talent Profile Management
- [ ] Resume Management
- [ ] Experience Management
- [ ] Education Management
- [ ] External Links Management
- [ ] Onboarding Process
- [ ] Profile Submission
- [ ] File Upload (Resume)
- [ ] Validation & Authorization
- [ ] Event Publishing
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] API Documentation

---

**🎉 Ready for implementation!**
