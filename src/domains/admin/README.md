# Admin Domain

## Overview
The Admin domain handles all administrative operations including user management, job moderation, system settings, and audit logging.

## Architecture Changes

### Repository Pattern Implementation
The admin domain has been refactored to follow proper DDD (Domain-Driven Design) principles by using custom repository classes instead of directly injecting TypeORM repositories.

#### Before (Anti-pattern):
```typescript
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    // ... other direct TypeORM repositories
  ) {}
}
```

#### After (Proper DDD):
```typescript
@Injectable()
export class AdminService {
  constructor(
    private adminRepo: AdminRepository,
    private auditLogRepo: AuditLogRepository,
    private systemSettingRepo: SystemSettingRepository,
  ) {}
}
```

### Benefits of This Approach

1. **Domain Encapsulation**: Custom repositories encapsulate domain-specific query logic
2. **Testability**: Easier to mock and test with custom repository interfaces
3. **Maintainability**: Business logic is separated from infrastructure concerns
4. **Consistency**: Follows the same pattern across all domains
5. **Type Safety**: Better type safety with domain-specific methods

### Custom Repository Methods

#### AdminRepository
- `findById(id: string)`: Find admin by ID with permissions
- `findAll()`: Get all admins with permissions
- `findByEmail(email: string)`: Find admin by email
- `findActiveAdmins()`: Get only active admins
- `findWithFilters(options)`: Advanced filtering with pagination
- `findByIds(ids: string[])`: Find multiple admins by IDs
- `findByStatus(status: string)`: Find admins by status
- `countByStatus(status: string)`: Count admins by status
- `findRecentAdmins(limit: number)`: Get recent admins

#### AuditLogRepository
- `findById(id: string)`: Find audit log by ID
- `findAll()`: Get all audit logs
- `findByAdmin(adminId: string, options)`: Find logs by admin
- `findByAction(action: string, options)`: Find logs by action
- `findWithFilters(options)`: Advanced filtering with pagination
- `log(data)`: Create new audit log entry

#### SystemSettingRepository
- `findAll()`: Get all system settings
- `setValue(key: string, value: any)`: Set system setting value
- Standard CRUD operations

### Service Layer Changes

The `AdminService` now uses only custom repository methods:

```typescript
// Before: Direct query builder usage
const queryBuilder = this.adminRepository.createQueryBuilder('user')
  .leftJoinAndSelect('user.talent', 'talent');

// After: Using custom repository method
const { data: users, total } = await this.adminRepo.findWithFilters({
  search,
  status,
  role,
  sortBy,
  sortOrder,
  skip,
  take: limit
});
```

### Migration Notes

1. **Job-related methods**: Now use real `JobRepository` instead of mock data. The admin service injects `JobRepository` from the job domain.

2. **Performance**: Custom repository methods can be optimized for specific use cases and can include caching strategies.

3. **Query Optimization**: The `findWithFilters` methods use TypeORM query builders internally but encapsulate the complexity within the repository layer.

### Repository Integration

The admin service now integrates with multiple repositories:

- **AdminRepository**: For admin user management
- **AuditLogRepository**: For audit logging
- **SystemSettingRepository**: For system settings
- **JobRepository**: For job management (newly added)

### New JobRepository Methods Added

The `JobRepository` has been extended with admin-specific methods:

- `findWithAdminFilters()`: Advanced filtering for admin job queries
- `findByIds()`: Find multiple jobs by IDs
- `bulkUpdateStatus()`: Bulk update job statuses
- `getJobStats()`: Get job statistics for dashboard
- `getJobsWithApplicationCount()`: Get jobs with application and referral counts

### Future Improvements

1. Add more domain-specific query methods as needed
2. Implement caching strategies in custom repositories
3. Consider implementing repository interfaces for better testability
4. Add real-time dashboard updates
5. Implement job analytics and reporting features 