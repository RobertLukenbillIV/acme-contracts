import { test } from 'node:test';
import assert from 'node:assert';
import { ErrorResponseSchema, ValidationErrorResponseSchema, ErrorCodeSchema } from './errors';

test('ErrorResponseSchema validates correct error', () => {
  const validError = {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    timestamp: '2024-01-01T00:00:00Z',
  };

  const result = ErrorResponseSchema.safeParse(validError);
  assert.strictEqual(result.success, true);
});

test('ValidationErrorResponseSchema validates validation error', () => {
  const validError = {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    timestamp: '2024-01-01T00:00:00Z',
    details: [
      {
        field: 'email',
        message: 'Invalid email format',
      },
    ],
  };

  const result = ValidationErrorResponseSchema.safeParse(validError);
  assert.strictEqual(result.success, true);
});

test('ErrorCodeSchema validates all error codes', () => {
  const validCodes = [
    'VALIDATION_ERROR',
    'NOT_FOUND',
    'UNAUTHORIZED',
    'FORBIDDEN',
    'CONFLICT',
    'INTERNAL_ERROR',
    'BAD_REQUEST',
    'RATE_LIMITED',
  ];

  validCodes.forEach((code) => {
    const result = ErrorCodeSchema.safeParse(code);
    assert.strictEqual(result.success, true);
  });
});
