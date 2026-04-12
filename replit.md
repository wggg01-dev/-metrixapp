# Metrix — B2B SaaS Admin Dashboard

## Overview

A full-stack B2B SaaS admin dashboard ("Metrix") built with React + Vite (frontend) and Express (backend), backed by PostgreSQL via Drizzle ORM. Manage customers, invoices, team users, analytics, settings, and a support desk.

## Architecture

### Monorepo Structure (pnpm workspaces)

```
/
├── package.json
├── pnpm-workspace.yaml        # workspace config + catalog
├── pnpm-lock.yaml
├── artifacts/
│   ├── tsconfig.base.json
│   ├── lib -> /home/runner/workspace/lib/lib/   # symlink (absolute)
│   └── artifacts/
│       ├── admin-dashboard/   # React + Vite frontend (port 5000)
│       ├── api-server/        # Express API backend (port 8080)
│       └── mockup-sandbox/    # Design sandbox
└── lib/
    ├── tsconfig.base.json
    └── lib/
        ├── api-client-react/  # Generated React Query hooks
        ├── api-spec/          # OpenAPI spec + codegen config
        ├── api-zod/           # Generated Zod validators
        └── db/                # Drizzle ORM schema + DB client
```

### Tech Stack

- **Frontend**: React 19, Vite 6, TailwindCSS 4, shadcn/ui, React Query, Wouter, Recharts
- **Backend**: Express 5, Pino, Drizzle ORM
- **Database**: PostgreSQL (Replit built-in)
- **Monorepo**: pnpm workspaces with catalog

### Services

| Service           | Port | Workflow Name      |
|-------------------|------|--------------------|
| Admin Dashboard   | 5000 | Start application  |
| API Server        | 8080 | API Server         |

## Database Schema (Drizzle ORM)

Tables in `lib/lib/db/src/schema/`:
- **customers** — Customer accounts with plan, status, MRR
- **team_users** — Internal team members with roles
- **invoices** — Customer invoices with status tracking
- **activity** — Activity feed/audit log

## Development

### Running the App

Both workflows must be active:
1. **Start application** — `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/admin-dashboard run dev`
2. **API Server** — `PORT=8080 pnpm --filter @workspace/api-server run dev`

### Installing Dependencies

```bash
pnpm install
```

### DB Schema Changes

```bash
pnpm --filter @workspace/db run push
```

### Key Notes

- `artifacts/lib` is an **absolute symlink** to `/home/runner/workspace/lib/lib/` (required for TS project references)
- Vite requires both `PORT` and `BASE_PATH` env vars at startup
- API server requires `PORT` env var at startup
- `pnpm-workspace.yaml` includes `onlyBuiltDependencies: [esbuild]` to allow esbuild's postinstall script

## API Endpoints

All endpoints under `/api`:
- `GET /api/healthz`
- `GET/POST /api/customers`
- `GET/PUT/DELETE /api/customers/:id`
- `GET/POST /api/users`
- `GET/POST /api/invoices`
- `GET /api/analytics/overview`
- `GET /api/activity`

## UI / Branding

### MetrixAnimatedLogo (`src/components/metrix-logo.tsx`)

SVG bar-chart "M" shape with Framer Motion staggered animations:
1. 5 bars grow from bottom → form the M silhouette (staggered, 0.09s apart)
2. Line path traces across bar tops (delay 0.65s)
3. Dots pop onto each bar top (delay 0.75s)
4. "etrix" text fades in (delay 1.05s)

Props: `dark` (boolean, default true), `size` (sm/md/lg), `className`.
Used in `login.tsx` (dark left panel + light mobile header) and `sidebar.tsx`.

### Pages & Features

- **Team page** — StatusDot shows active (green), pending/invited (amber), inactive/suspended (red); stats row with counts
- **Analytics / Revenue** — "Customer" column renamed to "Student / Account"
- **All major queries** — `refetchInterval: 30000` (30s auto-refresh)

## Demo Credentials

- Email: `admin@metrix.com`
- Password: `admin123`
