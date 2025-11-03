# acme-contracts

acme-contracts defines shared schemas, types, and OpenAPI specs for the Acme platform. Written in TypeScript, it serves as the single source of truth for all services and clients, generating SDKs for multiple languages to ensure consistent data models, validation, and error handling across the ecosystem.

## Overview

This monorepo contains:
- **Base Models**: Core types and schemas used across all domains
- **Error Schemas**: Standardized error responses and validation errors
- **Pagination Schemas**: Offset and cursor-based pagination types
- **Ticket Schema**: Complete ticket management domain models
- **OpenAPI Specifications**: Auto-generated API documentation
- **Multi-language SDKs**: Generated clients for TypeScript, Python, Java, Kotlin, C#, Go, and Swift

## Project Structure

```
acme-contracts/
├── packages/
│   ├── base/           # Base models and types
│   ├── errors/         # Error schemas
│   ├── pagination/     # Pagination schemas
│   └── tickets/        # Ticket domain schemas
├── .openapi-generator/ # SDK generation configs
├── .github/workflows/  # CI/CD workflows
└── openapi/           # Generated OpenAPI specs
```

## Installation

### For Development

```bash
npm install
npm run build
npm run test
```

### Using the Packages

```bash
# Install individual packages
npm install @acme/base
npm install @acme/errors
npm install @acme/pagination
npm install @acme/tickets
```

## Usage

### TypeScript

```typescript
import { Ticket, CreateTicketRequest, TicketStatus } from '@acme/tickets';
import { PaginatedResponse } from '@acme/pagination';
import { ErrorResponse } from '@acme/errors';

// Create a ticket request
const createRequest: CreateTicketRequest = {
  title: 'Bug in login form',
  description: 'Users cannot login with special characters in password',
  priority: 'high',
};

// Validate with Zod
import { CreateTicketRequestSchema } from '@acme/tickets';
const validated = CreateTicketRequestSchema.parse(createRequest);
```

### Using Generated SDKs

SDKs are automatically generated for multiple languages from the OpenAPI specifications:

- **TypeScript**: `@acme/tickets-sdk`
- **Python**: `acme-tickets-sdk`
- **Java**: `com.acme:acme-tickets-sdk`
- **Kotlin**: `com.acme:acme-tickets-sdk-kotlin`
- **C#**: `Acme.Tickets.Sdk`
- **Go**: `acme-tickets-sdk`
- **Swift**: `AcmeTicketsSDK`

## Available Scripts

### Root Level

- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages
- `npm run lint` - Lint all TypeScript files
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting
- `npm run typecheck` - Type check all packages
- `npm run generate:openapi` - Generate OpenAPI specs

## Packages

### @acme/base

Core types and base models including:
- `BaseEntity` - Entity with ID and timestamps
- `Timestamp` - Created/updated timestamp fields
- `Status` - Common status enum
- `Priority` - Priority levels

### @acme/errors

Error response schemas:
- `ErrorResponse` - Standard error response
- `ValidationErrorResponse` - Validation error with field details
- `ErrorCode` - Error code enum

### @acme/pagination

Pagination utilities:
- `PaginationQuery` - Offset-based pagination params
- `PaginationMeta` - Pagination metadata
- `PaginatedResponse` - Generic paginated response
- `CursorPaginationQuery` - Cursor-based pagination

### @acme/tickets

Ticket domain models:
- `Ticket` - Complete ticket schema
- `TicketStatus` - Ticket status enum
- `CreateTicketRequest` - Create ticket payload
- `UpdateTicketRequest` - Update ticket payload

## CI/CD

The repository includes automated workflows for:

### Continuous Integration (`ci.yml`)
- Linting and code formatting checks
- Type checking
- Build verification
- Test execution
- OpenAPI spec generation

### SDK Generation (`generate-sdks.yml`)
- Automatic SDK generation for all supported languages
- Triggered on main branch pushes and tags

### Publishing (`publish.yml`)
- Automatic publishing to npm, PyPI, Maven Central, and NuGet
- Triggered on release creation

## OpenAPI Specifications

OpenAPI specs are automatically generated from the TypeScript schemas using `zod-to-openapi`. The specs are available in the `openapi/` directory after running:

```bash
npm run generate:openapi
```

## Development

### Adding a New Schema

1. Create a new package in `packages/`
2. Define schemas using Zod
3. Add tests
4. Update OpenAPI generation script
5. Run build and tests

### Adding a New SDK Language

1. Add generator config in `.openapi-generator/`
2. Update `generate-sdks.yml` workflow
3. Update `publish.yml` if publishing is needed

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## License

MIT
