import type { Document } from '@documents/interface';
import { FirebaseAuthDto } from '@domains/auth/dtos/firebase-auth.dto';
import { ForgotPasswordDto } from '@domains/auth/dtos/forgot-password.dto';
import { LoginDto } from '@domains/auth/dtos/login.dto';
import { RegisterDto } from '@domains/auth/dtos/register.dto';
import { ResetPasswordDto } from '@domains/auth/dtos/reset-password.dto';
import { Web3AuthDto } from '@domains/auth/dtos/web3-auth.dto';

const login: Document = {
  operation: { summary: 'Login with email and password' },
  body: { type: LoginDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Login successful',
      },
    ],
    error: [{ status: 401, description: 'Invalid credentials' }],
  },
} as const;

const register: Document = {
  operation: { summary: 'Register new user' },
  body: { type: RegisterDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'User registered successfully',
      },
    ],
    error: [{ status: 409, description: 'User already exists' }],
  },
} as const;

const firebaseAuth: Document = {
  operation: { summary: 'Login with Firebase token' },
  body: { type: FirebaseAuthDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Firebase authentication successful',
      },
    ],
    error: [{ status: 401, description: 'Invalid Firebase token' }],
  },
} as const;

const web3Auth: Document = {
  operation: { summary: 'Login with Web3 wallet' },
  body: { type: Web3AuthDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Web3 authentication successful',
      },
    ],
    error: [{ status: 401, description: 'Invalid Web3 signature' }],
  },
} as const;

const forgotPassword: Document = {
  operation: { summary: 'Request password reset' },
  body: { type: ForgotPasswordDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Password reset email sent',
      },
    ],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

const resetPassword: Document = {
  operation: { summary: 'Reset password with token' },
  body: { type: ResetPasswordDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'Password reset successful',
      },
    ],
    error: [{ status: 400, description: 'Invalid or expired token' }],
  },
} as const;

const validateResetToken: Document = {
  operation: { summary: 'Validate password reset token' },
  query: {
    name: 'token',
    description: 'Reset token',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Token is valid',
      },
    ],
    error: [{ status: 400, description: 'Invalid or expired token' }],
  },
} as const;

const confirmEmail: Document = {
  operation: { summary: 'Confirm email address' },
  query: {
    name: 'confirmation_token',
    description: 'Email confirmation token',
    required: true,
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'Email confirmed successfully',
      },
    ],
    error: [
      { status: 400, description: 'Invalid or expired confirmation token' },
    ],
  },
} as const;

const socialCallback: Document = {
  operation: { summary: 'Social authentication callback' },
  body: { type: Object },
  responses: {
    success: [
      {
        status: 200,
        description: 'Social authentication successful',
      },
    ],
    error: [{ status: 400, description: 'Social authentication failed' }],
  },
} as const;

export const Docs = {
  login,
  register,
  firebaseAuth,
  web3Auth,
  forgotPassword,
  resetPassword,
  validateResetToken,
  confirmEmail,
  socialCallback,
};
