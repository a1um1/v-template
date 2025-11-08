## Quick orientation

- Runtime: Bun (scripts use `bun` / `bunx`). The server entry is `server.ts` (package.json `serve`).
- Backend: ElysiaJS serving API endpoints under `server/` (see `server/index.ts`, `server/routes/`).
- Database: PostgreSQL via Drizzle ORM. Drizzle config: `drizzle.config.ts` (dialect: postgresql). DB client lives in `server/db.ts` and reads `DATABASE_URL` from Bun env.
- Frontend: Vite + React + TanStack Start routing. Entry / route registry: `src/router.tsx` and `src/routeTree.gen.ts`.

## Where to start editing data models

- Drizzle schema files live in `server/schema/`. New tables must be exported from `server/schema/index.ts` so `drizzle-kit` picks them up.
- Convention examples: `server/schema/auth.ts` and `server/schema/product.ts` use `pgTable` from `drizzle-orm/pg-core`. Typical patterns:
  - id: `text().primaryKey()`
  - timestamps: `timestamp().$defaultFn(() => new Date()).notNull()` and `.$onUpdate(() => new Date())` for `updatedAt`
  - foreign keys: `references(() => otherTable.id, { onDelete: 'cascade' })`
  - JSONB: use `json().$defaultFn(() => ({})).notNull()` for flexible attributes

## Database workflow / useful scripts

- Push schema migrations / sync: `npm run db:push` (alias in package.json: `bunx --bun drizzle-kit push`).
- Open Drizzle studio: `npm run db:studio`.
- Generate auth schema: `npm run auth:generate` (uses `better-auth` CLI and writes to `server/schema/auth.ts`).
- Dev server: `npm run dev` (vite frontend) and `npm run serve` for running the backend with Bun.
- Typecheck: run the TypeScript compiler via your bun/npm wrapper: `bunx --bun tsc --noEmit`.

## Project-specific conventions to follow when generating code

- Prefer small, single-purpose pgTable files in `server/schema/` and export them from `server/schema/index.ts`.
- Use `text()` for IDs and SKUs; do not assume `serial` or `int` primary keys unless there's a clear reason.
- Use `json()` columns for type-specific product attributes rather than adding many nullable columns — this repo favors flexible JSON attributes for product variants.
- Keep `createdAt` and `updatedAt` fields on tables using the `$defaultFn` / `$onUpdate` pattern from existing schema files.
- When adding new API endpoints, follow the structure under `server/routes/` and export the route in `server/routes/index.ts`.

## Integration points and where to look for examples

- DB client & schema import: `server/db.ts` (shows how `drizzle` is initialised with `schema` import)
- Drizzle config: `drizzle.config.ts` (point of truth for dialect and schema file path)
- Auth schema generation: `package.json` script `auth:generate` and generated file `server/schema/auth.ts` (shows patterns for users/sessions)
- Frontend routing & data fetching: `src/router.tsx`, `src/routeTree.gen.ts`, and components under `src/routes/` (use TanStack Query for fetching)

## Examples to copy when adding a table or endpoint

- Add a new Drizzle table file `server/schema/<name>.ts` using `pgTable` and copy timestamp and id patterns from `server/schema/auth.ts`.
- Export the new table from `server/schema/index.ts`.
- Update backend code to use `db` from `server/db.ts` and import your table symbol from the schema module.
- Run `npm run db:push` to push schema changes.

## Testing your changes
- There are no testing requirements set up in this project.

## Frontend data fetching examples
- This project have OPENAPI-generated API clients under `http://localhost:3000/api/openapi/json` and you need to integrate this with elysia eden, for documentation refer to context7 MCP

## Small gotchas for AI code generation

- The repo uses Bun; generated shell commands or runtime code should target Bun-compatible usage (env access via `Bun.env`).
- Drizzle schemas use function-wrapped defaults (e.g. `$defaultFn(() => new Date())`). Avoid emitting raw SQL defaults as strings.
- `better-auth` may overwrite `server/schema/auth.ts` via `auth:generate`; do not duplicate or conflict with that generated code unless you intend to replace it.
- There is no need to add comments to code unless it's for complex logic that isn't self-explanatory.
- keep code style consistent with existing files (e.g., use of semicolons, quote styles, indentation).
- keep code minimal and avoid adding extra functionality beyond what's requested.

If anything here is unclear or you'd like more examples (API route scaffolds, Drizzle queries, or common frontend data-fetch patterns), tell me which area to expand.
