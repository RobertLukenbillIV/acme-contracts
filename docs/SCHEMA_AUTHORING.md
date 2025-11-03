## Schema authoring checklist

Follow these steps when adding or updating Zod schemas in `packages/*` so OpenAPI generation and SDKs stay consistent.

1. Add Zod schema files under `packages/<pkg>/src/` and export both the runtime schema and the TypeScript type. Example:

   - `export const TicketSchema = z.object({...})`
   - `export type Ticket = z.infer<typeof TicketSchema>`

2. If your package imports types/schemas from another workspace package (e.g., `@acme/base`), add a `references` entry to your `packages/<pkg>/tsconfig.json`:

```json
"references": [
  { "path": "../base" }
]
```

3. Add a `.test.ts` next to the source file for any runtime or schema validation tests. Tests run from compiled output (in `dist/`). Example package `test` scripts expect `dist` to contain compiled `.test.js` files.

4. Run the validation and build locally:

```bash
npm install
npm run validate:tsrefs
npm run build
npm run test
```

5. If you change exported symbol names (types, schema constants), be conservative — renaming public exports will affect downstream SDK generation.
