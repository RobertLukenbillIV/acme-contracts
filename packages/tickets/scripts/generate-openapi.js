"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const zod_1 = require("zod");
const zod_to_openapi_2 = require("@asteasolutions/zod-to-openapi");
const fs_1 = require("fs");
const path_1 = require("path");
const ticket_1 = require("../src/ticket");
const errors_1 = require("@acme/errors");
const pagination_1 = require("@acme/pagination");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
const registry = new zod_to_openapi_2.OpenAPIRegistry();
registry.register('Ticket', ticket_1.TicketSchema);
registry.register('TicketStatus', ticket_1.TicketStatusSchema);
registry.register('CreateTicketRequest', ticket_1.CreateTicketRequestSchema);
registry.register('UpdateTicketRequest', ticket_1.UpdateTicketRequestSchema);
registry.register('ErrorResponse', errors_1.ErrorResponseSchema);
registry.registerPath({
    method: 'get',
    path: '/api/v1/tickets',
    summary: 'List tickets',
    tags: ['Tickets'],
    request: {
        query: zod_1.z.object({
            page: zod_1.z.number().int().positive().optional(),
            limit: zod_1.z.number().int().positive().max(100).optional(),
            status: ticket_1.TicketStatusSchema.optional(),
        }),
    },
    responses: {
        200: {
            description: 'List of tickets',
            content: {
                'application/json': {
                    schema: (0, pagination_1.PaginatedResponseSchema)(ticket_1.TicketSchema),
                },
            },
        },
        400: {
            description: 'Bad request',
            content: {
                'application/json': {
                    schema: errors_1.ErrorResponseSchema,
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
                    schema: ticket_1.CreateTicketRequestSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Ticket created',
            content: {
                'application/json': {
                    schema: ticket_1.TicketSchema,
                },
            },
        },
        400: {
            description: 'Validation error',
            content: {
                'application/json': {
                    schema: errors_1.ErrorResponseSchema,
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
        params: zod_1.z.object({
            id: zod_1.z.string().uuid(),
        }),
    },
    responses: {
        200: {
            description: 'Ticket details',
            content: {
                'application/json': {
                    schema: ticket_1.TicketSchema,
                },
            },
        },
        404: {
            description: 'Ticket not found',
            content: {
                'application/json': {
                    schema: errors_1.ErrorResponseSchema,
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
        params: zod_1.z.object({
            id: zod_1.z.string().uuid(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: ticket_1.UpdateTicketRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Ticket updated',
            content: {
                'application/json': {
                    schema: ticket_1.TicketSchema,
                },
            },
        },
        404: {
            description: 'Ticket not found',
            content: {
                'application/json': {
                    schema: errors_1.ErrorResponseSchema,
                },
            },
        },
        400: {
            description: 'Validation error',
            content: {
                'application/json': {
                    schema: errors_1.ErrorResponseSchema,
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
        params: zod_1.z.object({
            id: zod_1.z.string().uuid(),
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
                    schema: errors_1.ErrorResponseSchema,
                },
            },
        },
    },
});
const generator = new zod_to_openapi_2.OpenApiGeneratorV3(registry.definitions);
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
const outputDir = (0, path_1.join)(__dirname, '..', '..', '..', 'openapi');
(0, fs_1.mkdirSync)(outputDir, { recursive: true });
const outputPath = (0, path_1.join)(outputDir, 'tickets.openapi.json');
(0, fs_1.writeFileSync)(outputPath, JSON.stringify(docs, null, 2));
console.log(`OpenAPI spec generated: ${outputPath}`);
//# sourceMappingURL=generate-openapi.js.map