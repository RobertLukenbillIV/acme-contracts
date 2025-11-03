import { test } from 'node:test';
import assert from 'node:assert';
import { BaseEntitySchema, TimestampSchema, StatusSchema, PrioritySchema } from './models';

test('TimestampSchema validates correct timestamps', () => {
  const validTimestamp = {
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const result = TimestampSchema.safeParse(validTimestamp);
  assert.strictEqual(result.success, true);
});

test('BaseEntitySchema validates correct entity', () => {
  const validEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const result = BaseEntitySchema.safeParse(validEntity);
  assert.strictEqual(result.success, true);
});

test('StatusSchema validates correct status', () => {
  const validStatuses = ['active', 'inactive', 'archived', 'deleted'];

  validStatuses.forEach((status) => {
    const result = StatusSchema.safeParse(status);
    assert.strictEqual(result.success, true);
  });
});

test('PrioritySchema validates correct priority', () => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];

  validPriorities.forEach((priority) => {
    const result = PrioritySchema.safeParse(priority);
    assert.strictEqual(result.success, true);
  });
});

test('BaseEntitySchema rejects invalid UUID', () => {
  const invalidEntity = {
    id: 'not-a-uuid',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const result = BaseEntitySchema.safeParse(invalidEntity);
  assert.strictEqual(result.success, false);
});
