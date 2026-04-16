# Metrix - B2B SaaS Admin Dashboard

## Overview
A B2B SaaS Admin Dashboard frontend built as a pnpm workspace. The app runs directly with Vite on port 8080.

## Architecture
- **Frontend**: React 19 + Vite 6 + TailwindCSS 4 + Shadcn/UI (Radix UI) + Recharts + Framer Motion + Wouter
- **Shared Libraries**: API spec, Zod validators, React Query hooks

## Monorepo Structure
```
artifacts/artifacts/
  admin-dashboard/   # React + Vite frontend (port 8080)
  mockup-sandbox/    # UI component sandbox
lib/lib/
  api-spec/          # OpenAPI spec + Orval codegen config
  api-zod/           # Generated Zod schemas
  api-client-react/  # Generated React Query hooks
artifacts/lib        # Symlink to lib/lib/ for TypeScript project references
```

## Running the Project (Development)
The app starts with `bash start.sh` which:
1. Installs dependencies if needed
2. Starts the Vite frontend app directly on port 8080

## Production Build & Deployment
Run `bash build.sh` to:
1. Install dependencies
2. Build frontend with Vite → `artifacts/artifacts/admin-dashboard/dist/`

## Key Ports
- **8080**: Vite frontend app

## Environment Variables
- `PORT`: App port (set to 8080 by `start.sh`)
- `VITE_PORT`: Vite dev server port (set to 8080 by `start.sh`)
- `NODE_ENV`: Set to `production` for production builds

## Package Management
Uses pnpm workspaces with catalog feature for centralized version management.
Install all deps: `pnpm install`
