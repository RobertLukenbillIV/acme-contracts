## Overview

This repository is a TypeScript monorepo (npm workspaces) that defines shared API schemas, Zod validators, and OpenAPI specs used to generate multi-language SDKs. The main packages live under `packages/`:

- `packages/base` — core models and types (`BaseEntitySchema`, `TimestampSchema`, `PrioritySchema`)
- `packages/errors` — standardized error schemas (`ErrorResponseSchema`, `ValidationErrorResponse`)
- `packages/pagination` — pagination types and helpers (`PaginatedResponseSchema`, `PaginationQuery`)
- `packages/tickets` — domain models and OpenAPI generation for tickets (`TicketSchema`, CRUD request types)

Key tech: TypeScript, Zod, `@asteasolutions/zod-to-openapi`, npm workspaces, tsc project references, and OpenAPI SDK generation to 7 languages (TypeScript, Python, Java, Kotlin, C#, Go, Swift).

## Immediate tasks an AI coding agent should know

- Build order: packages use `tsc -b` (composite builds). Run `npm install` then `npm run build` at repo root to build all packages.
- Tests run against compiled output. The package `test` scripts look for files in `dist` and run `node --test`. Always build before testing: `npm run build && npm run test`.
- OpenAPI/spec generation is implemented in `packages/tickets/scripts/generate-openapi.ts` and invoked by the package script `generate:openapi`. From repo root you can run `npm run generate:openapi` (root forwards the command to the `@acme/tickets` workspace).

## Project-specific conventions and patterns

- Schema source of truth: Zod schemas in `packages/*/src/*.ts`. Files export both the runtime schema (Zod) and typed exports (e.g., `Ticket`, `CreateTicketRequest`). Use `zod-to-openapi` when creating or extending OpenAPI shapes (see `packages/tickets`).
- Schema composition: Use `BaseEntitySchema.extend({...})` for entities, `z.enum()` for status values, and import shared types from `@acme/base` (like `PrioritySchema`). Follow the pattern: define schema, export type with `z.infer<typeof Schema>`.
- Build artifacts: compiled files are emitted to `dist/`. Tests in `package.json` target `dist` files (`find dist -name '*.test.js' -exec node --test {} +`). When adding tests, follow the existing pattern: put `.test.ts` next to sources and rely on the build step to emit test JS.
- Package references: packages depend on local workspace packages by name (e.g., `@acme/base`). The monorepo uses npm workspaces — do not publish package.json versions manually while working locally; use workspace resolution.
- Script names to reference in guidance or automation:
  - Root: `build`, `test`, `lint`, `format`, `format:check`, `typecheck`, `generate:openapi`, `generate:sdks`.
  - Package `@acme/tickets`: `generate:openapi` (uses `ts-node` and `tsconfig.scripts.json`).

## Build flow and project references

  - The canonical build command is `tsc -b` run from the repo root. This uses TypeScript project references and compiles packages in dependency order so local imports like `@acme/base` resolve during compilation.
  - **TypeScript configuration structure**:
    - Root `tsconfig.json` is a references-only container with `"files": []` — it doesn't compile anything itself.
    - Each package has `"composite": true` in its `tsconfig.json` and extends the root config for shared compiler options.
    - Package tsconfigs specify their own `outDir`, `rootDir`, `include`, and `references` arrays.
  - When adding a package-to-package dependency, update the dependent package's `tsconfig.json` `references` array to include the referenced package (example: `packages/tickets/tsconfig.json` references `../base`, `../errors`, and `../pagination`). This ensures `tsc -b` knows the compile-time graph.

## Validation and CI

- There's a lightweight validation script at `scripts/validate-tsrefs.js` and an npm script `validate:tsrefs` that checks `packages/*` for imports of `@acme/*` and ensures the importing package's `tsconfig.json` includes the referenced package under `references`.
- CI runs this validation early (`npm run validate:tsrefs`) to fail fast if a `tsconfig` reference is missing. Run it locally before opening PRs.

## Short checklist for schema authors

- See `docs/SCHEMA_AUTHORING.md` for a concise, step-by-step checklist when adding or modifying Zod schemas; it includes the recommended local commands and the `tsconfig` references rule.


## Important files and where to look

- `package.json` (root) — workspace scripts and Node/npm engine requirements (Node >=18, npm >=9).
- `packages/*/package.json` — per-package build/test scripts and dependencies.
- `packages/tickets/scripts/generate-openapi.ts` — OpenAPI generation entrypoint.
- `tsconfig.scripts.json` — scripts/CLI ts-node config used by generation scripts.
- `openapi/` and `.openapi-generator/` — generated specs and SDK generator configs.
- `.openapi-generator/` contains language-specific config files (e.g., `typescript-config.json`, `python-config.json`) for the 7 supported SDK languages.
- `packages/*/src` — primary source of truth for schemas and tests.

## Helpful, concrete examples for edits and PRs

- To add a new schema package:
  1. Create `packages/<name>` with a `package.json` following other packages.
 2. Author Zod schemas in `src/` and export runtime schema and types.
 3. Add `build` and `test` scripts mirroring existing packages (use `tsc -b` and `node --test` pattern).
 4. Run `npm run build` and `npm run test` from root.

- To update OpenAPI for tickets (local dev):
  - From repo root: `npm run generate:openapi` (this forwards to the `@acme/tickets` workspace script).
  - The generation script at `packages/tickets/scripts/generate-openapi.ts` registers both schemas AND API paths using `OpenAPIRegistry.registerPath()` with complete CRUD endpoints, query params, and error responses.

## Constraints and gotchas for an AI agent

- Always preserve existing Zod validators and exported type names (they are consumed by OpenAPI generation and downstream SDKs).
- Tests run on compiled code; do not assume tests execute TypeScript directly.
- Keep changes to public exports conservative: renaming types or exported symbols will break generated SDKs.

## Where to check CI behavior

- `.github/workflows/` contains CI steps (lint, typecheck, build, test, generate-sdks). Check workflow YAMLs when changing scripts or generation behavior.

## Common troubleshooting

- **Artifact download errors**: GitHub Actions artifacts are workflow-scoped. The `generate-sdks.yml` workflow generates its own OpenAPI specs rather than trying to download from `ci.yml`. Artifacts are shared within the same workflow run using consistent naming.
- **Build failures**: Always run `npm run validate:tsrefs` first - missing TypeScript project references are a common cause of build issues.
- **Test failures**: Remember tests run against compiled `dist/` output, not source TypeScript files. Run `npm run build` before `npm run test`.

---

If anything above is unclear or you want more specific examples (for example, a short checklist for adding a new field to a Zod schema and updating OpenAPI), tell me which area to expand and I will iterate. 
