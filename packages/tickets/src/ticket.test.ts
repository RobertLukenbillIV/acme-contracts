import { test } from 'node:test';
import assert from 'node:assert';
import {
  TicketSchema,
  TicketStatusSchema,
  CreateTicketRequestSchema,
  UpdateTicketRequestSchema,
} from './ticket';

test('TicketSchema validates correct ticket', () => {
  const validTicket = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test ticket',
    description: 'This is a test ticket',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const result = TicketSchema.safeParse(validTicket);
  assert.strictEqual(result.success, true);
});

test('TicketStatusSchema validates all statuses', () => {
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

  validStatuses.forEach((status) => {
    const result = TicketStatusSchema.safeParse(status);
    assert.strictEqual(result.success, true);
  });
});

test('CreateTicketRequestSchema validates create request', () => {
  const validRequest = {
    title: 'New ticket',
    description: 'Description of the ticket',
    priority: 'high',
  };

  const result = CreateTicketRequestSchema.safeParse(validRequest);
  assert.strictEqual(result.success, true);
});

test('CreateTicketRequestSchema applies default priority', () => {
  const request = {
    title: 'New ticket',
    description: 'Description',
  };

  const result = CreateTicketRequestSchema.parse(request);
  assert.strictEqual(result.priority, 'medium');
});

test('UpdateTicketRequestSchema validates update request', () => {
  const validRequest = {
    title: 'Updated title',
    status: 'in_progress',
  };

  const result = UpdateTicketRequestSchema.safeParse(validRequest);
  assert.strictEqual(result.success, true);
});

test('TicketSchema rejects invalid title length', () => {
  const invalidTicket = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: '',
    description: 'Description',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const result = TicketSchema.safeParse(invalidTicket);
  assert.strictEqual(result.success, false);
});
