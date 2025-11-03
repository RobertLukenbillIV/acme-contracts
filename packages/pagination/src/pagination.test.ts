import { test } from 'node:test';
import assert from 'node:assert';
import {
  PaginationQuerySchema,
  PaginationMetaSchema,
  CursorPaginationQuerySchema,
} from './pagination';

test('PaginationQuerySchema validates correct query', () => {
  const validQuery = {
    page: 1,
    limit: 20,
    sortOrder: 'asc' as const,
  };

  const result = PaginationQuerySchema.safeParse(validQuery);
  assert.strictEqual(result.success, true);
});

test('PaginationQuerySchema applies defaults', () => {
  const query = {};

  const result = PaginationQuerySchema.parse(query);
  assert.strictEqual(result.page, 1);
  assert.strictEqual(result.limit, 20);
  assert.strictEqual(result.sortOrder, 'asc');
});

test('PaginationMetaSchema validates correct meta', () => {
  const validMeta = {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: false,
  };

  const result = PaginationMetaSchema.safeParse(validMeta);
  assert.strictEqual(result.success, true);
});

test('CursorPaginationQuerySchema validates correct query', () => {
  const validQuery = {
    cursor: 'abc123',
    limit: 20,
  };

  const result = CursorPaginationQuerySchema.safeParse(validQuery);
  assert.strictEqual(result.success, true);
});
