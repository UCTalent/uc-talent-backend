# User Domain

## Overview
The User domain handles user management, authentication, and profile operations. It has been refactored to follow proper DDD (Domain-Driven Design) principles by using custom repository classes instead of directly injecting TypeORM repositories.

## Architecture Changes

### Repository Pattern Implementation

#### Before (Anti-pattern):
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userRepo: UserRepository,
  ) {}
}
```

#### After (Proper DDD):
```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}
}
```

### Benefits of This Approach

1. **Domain Encapsulation**: Custom repository encapsulates domain-specific query logic
2. **Testability**: Easier to mock and test with custom repository interface
3. **Maintainability**: Business logic is separated from infrastructure concerns
4. **Consistency**: Follows the same pattern across all domains
5. **Type Safety**: Better type safety with domain-specific methods

### Custom Repository Methods

#### UserRepository
- `findById(id: string)`: Find user by ID
- `findAll()`: Get all users
- `create(data: Partial<User>)`: Create new user
- `update(id: string, data: Partial<User>)`: Update user
- `delete(id: string)`: Delete user
- `softDelete(id: string)`: Soft delete user
- `restore(id: string)`: Restore soft deleted user
- `findByEmail(email: string)`: Find user by email
- `findByFirebaseUid(firebaseUid: string)`: Find user by Firebase UID
- `findByConfirmationToken(token: string)`: Find user by confirmation token
- `findByResetPasswordToken(token: string)`: Find user by reset password token
- `updateSignInInfo(id: string, ip: string)`: Update sign in information
- `incrementFailedAttempts(id: string)`: Increment failed login attempts
- `resetFailedAttempts(id: string)`: Reset failed login attempts
- `updateResetToken(userId: string, resetToken: string)`: Update reset password token
- `resetPassword(userId: string, hashedPassword: string)`: Reset user password
- `confirmUser(userId: string)`: Confirm user account

### Service Layer Changes

The `UserService` now uses only custom repository methods:

```typescript
// Before: Direct repository usage
const user = this.userRepository.create(data);
return this.userRepository.save(user);

// After: Using custom repository method
return this.userRepo.create(data);
```

### Key Refactoring Changes

1. **Removed TypeORM Repository injection**: No longer inject `Repository<User>` directly
2. **Simplified constructor**: Only inject `UserRepository`
3. **Consistent method usage**: All operations now use custom repository methods
4. **Better error handling**: Custom repository methods provide better error context

### Value Objects

The user domain uses value objects for better domain modeling:

#### Email Value Object
```typescript
export class Email {
  constructor(private readonly value: string) {
    // Validation logic
  }
}
```

#### Password Value Object
```typescript
export class Password {
  constructor(private readonly value: string) {
    // Validation and encryption logic
  }
}
```

### Authentication Features

The user service provides comprehensive authentication features:

1. **Password Management**: Secure password hashing and verification
2. **Account Confirmation**: Email confirmation workflow
3. **Password Reset**: Secure password reset with tokens
4. **Login Tracking**: Sign-in count and IP tracking
5. **Security Features**: Failed attempt tracking and account locking

### Usage Examples

#### Create User
```typescript
const user = await userService.create({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe'
});
```

#### Update User
```typescript
const updatedUser = await userService.update(userId, {
  firstName: 'Jane',
  lastName: 'Smith'
});
```

#### Password Verification
```typescript
const isValid = await userService.verifyPassword(user, 'password');
```

#### Account Confirmation
```typescript
await userService.confirmUser(userId);
```

### Migration Notes

1. **Backward Compatibility**: All existing method signatures remain the same
2. **Performance**: Custom repository methods can be optimized for specific use cases
3. **Testing**: Easier to mock custom repository for unit tests
4. **Maintenance**: Business logic is now clearly separated from infrastructure

### Future Improvements

1. Add more domain-specific query methods as needed
2. Implement caching strategies in custom repository
3. Add user search and filtering capabilities
4. Consider implementing repository interfaces for better testability
5. Add user activity tracking and analytics
