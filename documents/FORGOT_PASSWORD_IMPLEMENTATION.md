# Forgot Password Implementation

## Overview

The forgot password functionality allows users to reset their password through a secure email-based process. This implementation includes security features like token expiration, account validation, and proper error handling.

## Features

### Security Features

- **Token Expiration**: Reset tokens expire after 24 hours
- **Account Validation**: Only confirmed accounts can request password reset
- **Locked Account Protection**: Locked accounts cannot reset passwords
- **Secure Response**: Never reveals if an email exists in the system
- **Token Cleanup**: Expired tokens are automatically cleared

### User Experience

- **Professional Email Template**: Modern, responsive email design
- **Clear Instructions**: Step-by-step guidance for users
- **Token Validation**: Frontend can validate tokens before showing reset form
- **Error Handling**: Comprehensive error messages

## API Endpoints

### 1. Request Password Reset

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

**Validation:**

- Email must be valid format
- User account must be confirmed
- User account must not be locked

### 2. Validate Reset Token

```http
GET /auth/validate-reset-token?token=reset_token_here
```

**Response:**

```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Or for invalid/expired token:**

```json
{
  "valid": false,
  "message": "Invalid reset password token"
}
```

### 3. Reset Password

```http
PUT /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "new_password_here"
}
```

**Response:**

```json
{
  "message": "Password updated successfully"
}
```

**Validation:**

- Token must be valid and not expired
- Password must be at least 8 characters
- User account must not be locked

## Implementation Details

### Database Schema

The User entity includes these fields for password reset:

- `resetPasswordToken`: The reset token string
- `resetPasswordSentAt`: Timestamp when token was sent

### Email Template

Located at: `src/infrastructure/email/templates/password-reset.template.html`

Features:

- Responsive design
- Professional styling
- Security warnings
- Clear call-to-action button
- Fallback text link

### Security Considerations

1. **Token Generation**: Uses cryptographically secure random tokens
2. **Token Expiration**: 24-hour expiration for security
3. **Account State Validation**: Checks account confirmation and lock status
4. **Password Strength**: Enforces minimum 8-character requirement
5. **Token Cleanup**: Automatically clears expired tokens
6. **Privacy**: Never reveals if email exists in system

### Error Handling

| Error Case          | HTTP Status | Message                                                            |
| ------------------- | ----------- | ------------------------------------------------------------------ |
| Email not confirmed | 400         | "Please confirm your email first before requesting password reset" |
| Account locked      | 400         | "Account is locked. Please contact support."                       |
| Invalid token       | 400         | "Invalid or expired reset password token"                          |
| Expired token       | 400         | "Reset password token has expired. Please request a new one."      |
| Weak password       | 400         | "Password must be at least 8 characters long"                      |

## Frontend Integration

### 1. Request Password Reset

```javascript
const requestReset = async (email) => {
  try {
    const response = await fetch('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
  }
};
```

### 2. Validate Token (for reset page)

```javascript
const validateToken = async (token) => {
  try {
    const response = await fetch(`/auth/validate-reset-token?token=${token}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating token:', error);
  }
};
```

### 3. Reset Password

```javascript
const resetPassword = async (token, password) => {
  try {
    const response = await fetch('/auth/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
  }
};
```

## Testing

### Unit Tests

- Test token generation
- Test email sending
- Test password validation
- Test token expiration
- Test account state validation

### Integration Tests

- Test complete forgot password flow
- Test invalid token handling
- Test expired token handling
- Test email template rendering

### Manual Testing

1. Request password reset with valid email
2. Check email delivery and template rendering
3. Test token validation endpoint
4. Test password reset with valid token
5. Test error cases (invalid token, expired token, etc.)

## Configuration

### Environment Variables

- `FRONTEND_URL`: Base URL for reset password links (default: http://localhost:3000)

### Email Configuration

- SMTP settings in email service configuration
- Email templates in `src/infrastructure/email/templates/`

## Future Enhancements

1. **Rate Limiting**: Add rate limiting for forgot password requests
2. **Audit Logging**: Log password reset attempts for security monitoring
3. **Multiple Reset Prevention**: Prevent multiple active reset tokens per user
4. **SMS Fallback**: Add SMS-based password reset as alternative
5. **Security Questions**: Add security questions for additional verification
