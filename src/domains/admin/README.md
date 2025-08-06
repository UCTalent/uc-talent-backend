# Admin Domain

## Overview

The Admin domain provides comprehensive administrative functionality for the UC Talent platform, including dashboard management, user management, job management, talent management, payment management, and system management.

## Features

### 📊 Dashboard Management
- Real-time statistics and analytics
- Charts and data visualization
- Recent activities tracking

### 👥 User Management
- User listing with filtering and pagination
- User status management (active, inactive, suspended)
- User role management
- Search and sort functionality

### 💼 Job Management
- Job listing with advanced filtering
- Job status management (approve, reject, bulk actions)
- Job analytics and statistics
- Organization and speciality filtering

### 👨‍💼 Talent Management
- Talent profile review and verification
- Experience level and English proficiency filtering
- Talent status management

### 💰 Payment Management
- Payment distribution tracking
- Payment approval workflow
- Payment analytics

### ⚙️ System Management
- System settings configuration
- Audit logging
- System maintenance

## Entities

### Admin
- Core admin user entity
- Authentication and authorization
- Session management
- Permission system

### AuditLog
- Comprehensive activity logging
- Admin action tracking
- IP address and user agent logging

### SystemSetting
- Configurable system parameters
- Support for different data types (string, number, boolean, json)
- Encrypted settings support

### AdminSession
- Session management for admins
- Token-based authentication
- Session expiration handling

### AdminPermission
- Role-based access control
- Resource and action permissions
- Permission mapping system

## Endpoints

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - Get users list
- `PATCH /api/admin/users/:id/status` - Update user status

### Job Management
- `GET /api/admin/jobs` - Get jobs list
- `PATCH /api/admin/jobs/:id/status` - Update job status
- `POST /api/admin/jobs/bulk-actions` - Execute bulk job actions

### Talent Management
- `GET /api/admin/talents` - Get talents list
- `POST /api/admin/talents/:id/review` - Review talent profile

### Payment Management
- `GET /api/admin/payment-distributions` - Get payment distributions
- `POST /api/admin/payment-distributions/:id/approve` - Approve payment

### System Management
- `GET /api/admin/settings` - Get system settings
- `PATCH /api/admin/settings` - Update system settings
- `GET /api/admin/audit-logs` - Get audit logs

## DTOs

### AdminUserQueryDto
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
}
```

### UpdateUserStatusDto
```typescript
{
  status: string;
  reason?: string;
  adminId: string;
}
```

### AdminJobQueryDto
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organization?: string;
  speciality?: string;
  dateFrom?: string;
  dateTo?: string;
}
```

### UpdateJobStatusDto
```typescript
{
  status: string;
  reason?: string;
  adminId: string;
}
```

### BulkJobActionDto
```typescript
{
  action: string;
  jobIds: string[];
  reason?: string;
  adminId: string;
}
```

## Services

### AdminService
- Dashboard statistics calculation
- User management operations
- Job management operations
- System settings management
- Audit logging

## Repositories

### AdminRepository
- Admin CRUD operations
- Email-based queries
- Login attempt management

### AuditLogRepository
- Audit log CRUD operations
- Admin-specific log queries
- Action-based filtering

### SystemSettingRepository
- System settings CRUD operations
- Type-safe value retrieval
- Dynamic setting management

## Security

### AdminGuard
- JWT token validation
- Admin type verification
- Request authentication

### AdminJwtStrategy
- JWT strategy for admin authentication
- Payload validation
- Type-specific authentication

## Usage Examples

### Get Dashboard Statistics
```typescript
const stats = await adminService.getDashboardStats();
```

### Update User Status
```typescript
const result = await adminService.updateUserStatus(userId, {
  status: 'suspended',
  reason: 'Violation of terms',
  adminId: 'admin-uuid'
});
```

### Execute Bulk Job Actions
```typescript
const result = await adminService.executeBulkJobAction({
  action: 'approve',
  jobIds: ['job-1', 'job-2', 'job-3'],
  reason: 'Bulk approval',
  adminId: 'admin-uuid'
});
```

### Update System Settings
```typescript
const result = await adminService.updateSystemSettings({
  platformFee: 0.05,
  maxJobDuration: 90,
  autoApproveJobs: false,
  maintenanceMode: false
});
```

## Testing

Run the tests with:
```bash
npm test src/domains/admin/controllers/admin.controller.spec.ts
```

## Database Migrations

The admin domain requires the following database tables:
- `admins`
- `audit_logs`
- `system_settings`
- `admin_sessions`
- `admin_permissions`
- `admin_permission_mappings`

Migration files should be created according to the entity specifications in the documentation.

## Authentication

All admin endpoints require authentication using the AdminGuard. The guard validates JWT tokens and ensures the user has admin privileges.

## Audit Logging

All administrative actions are automatically logged to the audit_logs table, including:
- User status changes
- Job status updates
- Bulk actions
- System setting changes
- Login attempts

## Configuration

The admin domain can be configured through system settings:
- Platform fees
- Job duration limits
- Auto-approval settings
- Maintenance mode
- Security settings 