# Metrix - B2B SaaS Admin Dashboard

## Overview
A full-stack B2B SaaS Admin Dashboard built as a pnpm monorepo. Features a React frontend and Express backend with PostgreSQL database.

## Architecture
- **Frontend**: React 19 + Vite 6 + TailwindCSS 4 + Shadcn/UI (Radix UI) + Recharts + Framer Motion + Wouter
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Shared Libraries**: API spec (OpenAPI), Zod validators, React Query hooks, DB schema

## Monorepo Structure
```
artifacts/artifacts/
  admin-dashboard/   # React + Vite frontend (port 3000 in dev)
  api-server/        # Express API server (port 5000, proxies to Vite)
  mockup-sandbox/    # UI component sandbox
lib/lib/
  db/                # Drizzle ORM schema + PostgreSQL client
  api-spec/          # OpenAPI spec + Orval codegen config
  api-zod/           # Generated Zod schemas
  api-client-react/  # Generated React Query hooks
artifacts/lib        # Symlink to lib/lib/ for TypeScript project references
```

## Running the Project
The app starts with `bash start.sh` which:
1. Installs dependencies if needed
2. Pushes DB schema with Drizzle
3. Starts Vite dev server on port 3000 (background)
4. Builds and starts Express API server on port 5000

The API server on port 5000 handles `/api` routes and proxies all other traffic to Vite on port 3000.

## Key Ports
- **5000**: Express API server (Replit webview port)
- **3000**: Vite dev server (internal)

## Environment Variables
- `DATABASE_URL` + `PG*` variables: Set automatically by Replit PostgreSQL database
- `PORT`: API server port (set to 5000 in workflow)
- `VITE_PORT`: Vite dev server port (set to 3000 in workflow)

## Database
Uses Replit's built-in PostgreSQL. Schema managed via Drizzle ORM.
Run schema push: `pnpm --filter @workspace/db run push`

## Package Management
Uses pnpm workspaces with catalog feature for centralized version management.
Install all deps: `pnpm install`
