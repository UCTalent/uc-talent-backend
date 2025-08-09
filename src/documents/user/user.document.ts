import { Document } from '@documents/interface';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { UpdateUserDto } from '@user/dtos/update-user.dto';
import {
  UserResponseDto,
  UserListResponseDto,
} from '@user/dtos/user-response.dto';

const createUser: Document = {
  operation: { summary: 'Create a new user' },
  body: { type: CreateUserDto },
  responses: {
    success: [
      {
        status: 201,
        description: 'User created successfully',
        type: UserResponseDto,
      },
    ],
    error: [
      { status: 400, description: 'Bad request - validation error' },
      { status: 409, description: 'Conflict - user already exists' },
    ],
  },
} as const;

const getUsers: Document = {
  operation: { summary: 'Get all users' },
  responses: {
    success: [
      {
        status: 200,
        description: 'Users retrieved successfully',
        type: UserListResponseDto,
      },
    ],
  },
} as const;

const getUserById: Document = {
  operation: { summary: 'Get user by ID' },
  param: {
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [
      {
        status: 200,
        description: 'User found successfully',
        type: UserResponseDto,
      },
    ],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

const updateUser: Document = {
  operation: { summary: 'Update user by ID' },
  param: {
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  body: { type: UpdateUserDto },
  responses: {
    success: [
      {
        status: 200,
        description: 'User updated successfully',
        type: UserResponseDto,
      },
    ],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

const deleteUser: Document = {
  operation: { summary: 'Delete user by ID' },
  param: {
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [{ status: 200, description: 'User deleted successfully' }],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

const softDeleteUser: Document = {
  operation: { summary: 'Soft delete user by ID' },
  param: {
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [{ status: 200, description: 'User soft deleted successfully' }],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

const restoreUser: Document = {
  operation: { summary: 'Restore soft deleted user by ID' },
  param: {
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  },
  responses: {
    success: [{ status: 200, description: 'User restored successfully' }],
    error: [{ status: 404, description: 'User not found' }],
  },
} as const;

export const Docs = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  softDeleteUser,
  restoreUser,
};
