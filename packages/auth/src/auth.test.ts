import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  SignupRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  AuthResponseSchema,
  UserResponseSchema,
} from './auth';

describe('Auth Schemas', () => {
  it('should validate a valid signup request', () => {
    const validSignup = {
      email: 'user@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
    };

    const result = SignupRequestSchema.safeParse(validSignup);
    assert.strictEqual(result.success, true);
  });

  it('should reject invalid email in signup', () => {
    const invalidSignup = {
      email: 'invalid-email',
      password: 'SecurePass123!',
      name: 'John Doe',
    };

    const result = SignupRequestSchema.safeParse(invalidSignup);
    assert.strictEqual(result.success, false);
  });

  it('should reject short password in signup', () => {
    const invalidSignup = {
      email: 'user@example.com',
      password: 'short',
      name: 'John Doe',
    };

    const result = SignupRequestSchema.safeParse(invalidSignup);
    assert.strictEqual(result.success, false);
  });

  it('should validate a valid login request', () => {
    const validLogin = {
      email: 'user@example.com',
      password: 'SecurePass123!',
    };

    const result = LoginRequestSchema.safeParse(validLogin);
    assert.strictEqual(result.success, true);
  });

  it('should validate a valid refresh token request', () => {
    const validRefresh = {
      refreshToken: '550e8400-e29b-41d4-a716-446655440000',
    };

    const result = RefreshTokenRequestSchema.safeParse(validRefresh);
    assert.strictEqual(result.success, true);
  });

  it('should reject invalid UUID in refresh token', () => {
    const invalidRefresh = {
      refreshToken: 'not-a-uuid',
    };

    const result = RefreshTokenRequestSchema.safeParse(invalidRefresh);
    assert.strictEqual(result.success, false);
  });

  it('should validate a valid auth response', () => {
    const validAuth = {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: '550e8400-e29b-41d4-a716-446655440000',
      tokenType: 'Bearer',
      expiresIn: 86400000,
    };

    const result = AuthResponseSchema.safeParse(validAuth);
    assert.strictEqual(result.success, true);
  });

  it('should validate a valid user response', () => {
    const validUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: '2024-01-01T12:00:00.000Z',
      updatedAt: '2024-01-01T12:00:00.000Z',
      enabled: true,
    };

    const result = UserResponseSchema.safeParse(validUser);
    assert.strictEqual(result.success, true);
  });

  it('should reject invalid email in user response', () => {
    const invalidUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'not-an-email',
      name: 'John Doe',
      createdAt: '2024-01-01T12:00:00.000Z',
      updatedAt: '2024-01-01T12:00:00.000Z',
      enabled: true,
    };

    const result = UserResponseSchema.safeParse(invalidUser);
    assert.strictEqual(result.success, false);
  });
});
