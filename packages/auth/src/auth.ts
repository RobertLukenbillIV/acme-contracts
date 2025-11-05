import { z } from 'zod';
import { BaseEntitySchema } from '@acme/base';

/**
 * Signup request schema
 */
export const SignupRequestSchema = z.object({
  email: z.string().email('Email must be valid'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(200, 'Name must be between 1 and 200 characters'),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * Refresh token request schema
 */
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().uuid('Refresh token must be a valid UUID'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

/**
 * Authentication response schema with tokens
 */
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().uuid(),
  tokenType: z.string().default('Bearer'),
  expiresIn: z.number().int().positive(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * User response schema
 * Extends BaseEntity to include standard fields (id, createdAt, updatedAt)
 */
export const UserResponseSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string(),
  enabled: z.boolean(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
