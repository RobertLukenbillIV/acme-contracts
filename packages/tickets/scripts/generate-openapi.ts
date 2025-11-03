import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  TicketSchema,
  TicketStatusSchema,
  CreateTicketRequestSchema,
  UpdateTicketRequestSchema,
} from '../src/ticket';
import { ErrorResponseSchema } from '@acme/errors';
import { PaginatedResponseSchema } from '@acme/pagination';

// Extend Zod with OpenAPI
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Register schemas
registry.register('Ticket', TicketSchema);
registry.register('TicketStatus', TicketStatusSchema);
registry.register('CreateTicketRequest', CreateTicketRequestSchema);
registry.register('UpdateTicketRequest', UpdateTicketRequestSchema);
registry.register('ErrorResponse', ErrorResponseSchema);

// Register API paths
registry.registerPath({
  method: 'get',
  path: '/api/v1/tickets',
  summary: 'List tickets',
  tags: ['Tickets'],
  request: {
    query: z.object({
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(100).optional(),
      status: TicketStatusSchema.optional(),
    }),
  },
  responses: {
    200: {
      description: 'List of tickets',
      content: {
        'application/json': {
          schema: PaginatedResponseSchema(TicketSchema),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/tickets',
  summary: 'Create a ticket',
  tags: ['Tickets'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTicketRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Ticket created',
      content: {
        'application/json': {
          schema: TicketSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/tickets/{id}',
  summary: 'Get a ticket by ID',
  tags: ['Tickets'],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Ticket details',
      content: {
        'application/json': {
          schema: TicketSchema,
        },
      },
    },
    404: {
      description: 'Ticket not found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/tickets/{id}',
  summary: 'Update a ticket',
  tags: ['Tickets'],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateTicketRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Ticket updated',
      content: {
        'application/json': {
          schema: TicketSchema,
        },
      },
    },
    404: {
      description: 'Ticket not found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/tickets/{id}',
  summary: 'Delete a ticket',
  tags: ['Tickets'],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    204: {
      description: 'Ticket deleted',
    },
    404: {
      description: 'Ticket not found',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// Generate OpenAPI spec
const generator = new OpenApiGeneratorV3(registry.definitions);
const docs = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Acme Tickets API',
    version: '1.0.0',
    description: 'API for managing tickets in the Acme platform',
  },
  servers: [
    {
      url: 'https://api.acme.com',
      description: 'Production server',
    },
    {
      url: 'https://api.staging.acme.com',
      description: 'Staging server',
    },
  ],
});

// Write to file - use resolve for robust path handling
const outputDir = resolve(__dirname, '..', '..', '..', 'openapi');
mkdirSync(outputDir, { recursive: true });

const outputPath = resolve(outputDir, 'tickets.openapi.json');
writeFileSync(outputPath, JSON.stringify(docs, null, 2));

console.log(`OpenAPI spec generated: ${outputPath}`);
