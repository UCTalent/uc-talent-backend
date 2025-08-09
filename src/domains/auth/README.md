# Authentication Domain

## Overview

The Authentication domain handles all authentication and authorization operations including traditional email/password login, Firebase authentication, and Web3/Thirdweb authentication.

## Features

### 🔐 Traditional Authentication

- Email/password registration and login
- Password hashing with bcrypt
- Email confirmation workflow
- Password reset functionality
- Account locking and unlock

### 🔥 Firebase Authentication

- Firebase token verification
- Automatic user creation/linking
- Support for multiple Firebase providers (Google, Facebook, etc.)
- Auto-confirmation for Firebase users

### 🌐 Web3/Thirdweb Authentication

- JWT token verification
- Support for multiple social providers:
  - Google
  - GitHub
  - Discord
  - X (Twitter)
  - Telegram
  - Email
  - Phone
  - Passkey
- Wallet authentication
- Automatic email generation for providers without email

## Architecture

### Services

#### AuthService

Main authentication service that orchestrates all authentication methods:

- `login()`: Traditional email/password login
- `register()`: User registration with email confirmation
- `firebaseAuth()`: Firebase authentication
- `web3Auth()`: Web3/Thirdweb authentication
- `forgotPassword()`: Password reset request
- `resetPassword()`: Password reset
- `confirmEmail()`: Email confirmation

#### FirebaseAuthService

Handles Firebase-specific authentication:

- `authenticate()`: Verify Firebase token and create/link user
- `extractUserData()`: Extract user information from Firebase token
- `findOrCreateUser()`: Find existing user or create new one

#### Web3AuthService

Handles Web3/Thirdweb-specific authentication:

- `authenticate()`: Verify JWT token and create/link user
- `extractUserInfo()`: Extract user information from JWT payload
- `findOrCreateUser()`: Find existing user or create new one

### DTOs

#### LoginDto

```typescript
{
  email: string;
  password: string;
}
```

#### RegisterDto

```typescript
{
  name: string;
  email: string;
  password: string;
  location_city_id?: string;
  ref_code?: string;
}
```

#### FirebaseAuthDto

```typescript
{
  firebase_token: string;
}
```

#### Web3AuthDto

```typescript
{
  jwt_token: string;
  client_id?: string;
  client_secret?: string;
}
```

#### ForgotPasswordDto

```typescript
{
  email: string;
}
```

#### ResetPasswordDto

```typescript
{
  token: string;
  password: string;
}
```

## API Endpoints

### Traditional Authentication

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token_type": "Bearer",
  "access_token": "jwt_token",
  "expires_in": 7200,
  "has_profile": false
}
```

#### Register

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "location_city_id": "city_id",
  "ref_code": "REF123"
}

Response:
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "confirmed_at": null
  },
  "message": "Confirmation email sent"
}
```

### Firebase Authentication

#### Firebase Auth

```
POST /api/v1/auth/firebase
Content-Type: application/json

{
  "firebase_token": "firebase_id_token"
}

Response:
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "user_id": "user_id",
  "token_type": "Bearer",
  "access_token": "oauth_access_token",
  "expires_in": 7200,
  "created_at": 1234567890,
  "refresh_token": "refresh_token",
  "has_profile": false
}
```

### Web3/Thirdweb Authentication

#### Web3 Auth

```
POST /api/v1/auth/web3
Content-Type: application/json

{
  "jwt_token": "thirdweb_jwt_token",
  "client_id": "oauth_client_id",
  "client_secret": "oauth_client_secret"
}

Response:
{
  "access_token": "oauth_access_token",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "refresh_token",
  "scope": "public",
  "created_at": 1234567890
}
```

### Password Management

#### Forgot Password

```
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Reset password email sent"
}
```

#### Reset Password

```
PUT /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password"
}

Response:
{
  "message": "Password updated successfully"
}
```

#### Confirm Email

```
GET /api/v1/auth/confirm-email?confirmation_token=token

Response:
{
  "message": "Email confirmed successfully"
}
```

## User Entity Fields

The User entity includes all necessary fields for authentication:

### Firebase Fields

- `firebaseUid`: Firebase user ID
- `firebaseProvider`: Firebase authentication provider

### Web3 Fields

- `thirdwebMetadata`: JSONB field for Thirdweb user metadata

### Traditional Fields

- `email`: User email address
- `encryptedPassword`: Hashed password
- `confirmationToken`: Email confirmation token
- `confirmedAt`: Email confirmation timestamp
- `resetPasswordToken`: Password reset token
- `resetPasswordSentAt`: Password reset sent timestamp

### Security Fields

- `lockedAt`: Account lock timestamp
- `failedAttempts`: Failed login attempts count
- `unlockToken`: Account unlock token

## Implementation Notes

### Firebase Authentication

- Uses Firebase Admin SDK for token verification
- Automatically creates users for new Firebase accounts
- Links existing users by email or Firebase UID
- Auto-confirms Firebase users (no email confirmation required)

### Web3/Thirdweb Authentication

- Supports multiple social providers with automatic email generation
- Handles wallet authentication
- Stores provider metadata in `thirdwebMetadata` field
- Auto-confirms certain providers (Google, Discord with email)

### Security Features

- Password hashing with bcrypt (12 rounds)
- Account locking after failed attempts
- Email confirmation workflow
- Secure token generation
- IP tracking for sign-ins

## Environment Variables

Required environment variables:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Firebase Configuration (for production)
FIREBASE_SA_KEY=base64_encoded_service_account_key

# Web3 Configuration (for production)
JWKS_AUTHENTICATION_SVC_URL=https://your-auth-service.com/.well-known/jwks.json
UC_GATEWAY_API_KEY=your_gateway_api_key
```

## Future Improvements

1. **Real Firebase Integration**: Replace mock Firebase Admin SDK with real implementation
2. **Real JWT Verification**: Implement proper JWKS verification for Web3 tokens
3. **OAuth Token Generation**: Generate real OAuth tokens instead of mock ones
4. **Email Service Integration**: Implement email sending for confirmations and resets
5. **Rate Limiting**: Add rate limiting for authentication endpoints
6. **Audit Logging**: Log authentication events for security monitoring
7. **Multi-factor Authentication**: Add MFA support
8. **Social Login Callback**: Implement social login callback endpoints

## Testing

### Mock Tokens for Testing

- Firebase: Use `"valid_firebase_token"` for successful authentication
- Web3: Use `"valid_jwt_token"` for successful authentication

### Test Scenarios

1. Traditional email/password login
2. User registration with email confirmation
3. Firebase authentication with new user
4. Firebase authentication with existing user
5. Web3 authentication with different providers
6. Password reset workflow
7. Account locking after failed attempts

## Migration from Rails

This implementation follows the same patterns as the Rails migration guide:

- Firebase token verification and user management
- JWT decoding and user extraction
- Automatic user creation/linking
- Provider-specific email generation
- Metadata storage for Web3 users

The main differences are:

- Uses NestJS instead of Rails
- Uses TypeORM instead of ActiveRecord
- Uses JWT instead of Doorkeeper OAuth
- Simplified token generation (mock OAuth tokens)
