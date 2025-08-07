# Database Migrations

## 📋 Tổng quan

Thư mục này chứa tất cả các migration files cho toàn bộ hệ thống UC Talent Backend.

## 🗄️ Migration Files

### Core Infrastructure
1. **1700000000000-CreateUuidExtension.ts** - Tạo extension uuid-ossp

### Location Domain
2. **1700000000011-CreateCountries.ts** - Tạo bảng countries
3. **1700000000012-CreateRegions.ts** - Tạo bảng regions
4. **1700000000013-CreateCities.ts** - Tạo bảng cities

### User Domain
5. **1700000000010-CreateUsers.ts** - Tạo bảng users

### Skill Domain
6. **1700000000014-CreateRoles.ts** - Tạo bảng roles
7. **1700000000015-CreateSkills.ts** - Tạo bảng skills
8. **1700000000016-CreateSpecialities.ts** - Tạo bảng specialities

### Talent Domain
9. **1700000000001-CreateTalents.ts** - Tạo bảng talents
10. **1700000000002-CreateExperiences.ts** - Tạo bảng experiences
11. **1700000000003-CreateEducations.ts** - Tạo bảng educations
12. **1700000000004-CreateExternalLinks.ts** - Tạo bảng external_links
13. **1700000000005-CreateUploadedResumes.ts** - Tạo bảng uploaded_resumes
14. **1700000000006-CreateRecommendationJobs.ts** - Tạo bảng recommendation_jobs
15. **1700000000007-CreateTalentSpecialities.ts** - Tạo bảng junction talent_specialities
16. **1700000000008-CreateTalentSkills.ts** - Tạo bảng junction talent_skills
17. **1700000000009-CreateTalentRoles.ts** - Tạo bảng junction talent_roles

## 🚀 Cách chạy migrations

### 1. Chạy tất cả migrations

```bash
npm run migration:run
```

### 2. Revert migration cuối cùng

```bash
npm run migration:revert
```

### 3. Generate migration mới (nếu có thay đổi entities)

```bash
npm run migration:generate src/infrastructure/database/migrations/[MigrationName]
```

## 📊 Database Schema

### Core Tables
- **users** - Thông tin người dùng
- **countries** - Quốc gia
- **regions** - Khu vực
- **cities** - Thành phố

### Skill Domain
- **roles** - Vai trò công việc
- **skills** - Kỹ năng
- **specialities** - Chuyên môn

### Talent Domain
- **talents** - Thông tin chính của talent
- **experiences** - Kinh nghiệm làm việc
- **educations** - Học vấn
- **external_links** - Liên kết mạng xã hội
- **uploaded_resumes** - CV đã upload
- **recommendation_jobs** - Jobs được recommend cho talent

### Junction Tables (many-to-many)
- **talent_specialities** - Quan hệ talent - speciality
- **talent_skills** - Quan hệ talent - skill
- **talent_roles** - Quan hệ talent - role

## 🔧 Lưu ý

1. **Thứ tự chạy migrations**: Đảm bảo chạy theo thứ tự từ cũ đến mới
2. **Dependencies**: Một số bảng phụ thuộc vào bảng khác (foreign keys)
3. **Environment**: Kiểm tra file `.env` có đúng thông tin database
4. **Backup**: Backup database trước khi chạy migrations trong production

## 🐛 Troubleshooting

### Lỗi "uuid-ossp extension not found"
```bash
# Kết nối vào PostgreSQL và chạy
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Lỗi foreign key constraint
- Kiểm tra các bảng được reference đã tồn tại
- Chạy migrations theo đúng thứ tự
- Đảm bảo bảng parent được tạo trước bảng child

### Lỗi enum type
- Kiểm tra enum values có đúng với entity không
- Đảm bảo enum được tạo trước khi sử dụng

### Lỗi duplicate migration
- Kiểm tra tên migration class không trùng lặp
- Đảm bảo timestamp trong tên file là duy nhất

## 📝 Migration Best Practices

1. **Naming Convention**: Sử dụng format `[timestamp]-[Action][TableName].ts`
2. **Atomic Changes**: Mỗi migration chỉ thực hiện một thay đổi logic
3. **Rollback**: Luôn implement method `down()` để có thể revert
4. **Indexes**: Tạo indexes cho các cột thường query
5. **Foreign Keys**: Đặt tên rõ ràng cho foreign key constraints
6. **Data Types**: Sử dụng đúng data type cho từng cột
7. **Nullable**: Chỉ định rõ nullable cho các cột có thể null
