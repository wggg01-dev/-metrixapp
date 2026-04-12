# B2B SaaS Admin Dashboard

## Overview

A full-stack B2B SaaS admin dashboard built with React + Vite (frontend) and Express (backend), backed by PostgreSQL via Drizzle ORM. The app lets you manage customers, invoices, team users, and view analytics.

## Architecture

### Monorepo Structure

The project uses a pnpm workspace with the following layout:

```
/
├── package.json           # Root workspace package
├── pnpm-workspace.yaml    # pnpm workspace config + catalog
├── artifacts/
│   ├── tsconfig.base.json # Base TS config for artifacts packages
│   ├── lib -> lib/lib/    # Symlink to shared lib packages
│   └── artifacts/
│       ├── admin-dashboard/  # React + Vite frontend (port 22133)
│       ├── api-server/       # Express API backend (port 8080)
│       └── mockup-sandbox/   # Design sandbox
└── lib/
    ├── tsconfig.base.json    # Base TS config for lib packages
    └── lib/
        ├── api-client-react/ # Generated React Query hooks
        ├── api-spec/         # OpenAPI spec + codegen config
        ├── api-zod/          # Generated Zod validators
        └── db/               # Drizzle ORM schema + DB client
```

### Tech Stack

- **Frontend**: React 19, Vite 6, TailwindCSS 4, shadcn/ui, React Query, Wouter (routing), Recharts
- **Backend**: Express 5, Pino (logging), Drizzle ORM
- **Database**: PostgreSQL (Replit built-in)
- **Monorepo**: pnpm workspaces with catalog

### Services

| Service | Port | Path |
|---------|------|------|
| Admin Dashboard (Vite dev) | 22133 | `/` |
| API Server (Express) | 8080 | `/api` |

## Database Schema

Tables managed by Drizzle ORM in `lib/lib/db/src/schema/`:

- **customers** - Customer accounts with plan, status, MRR
- **team_users** - Internal team members with roles
- **invoices** - Customer invoices with status tracking
- **activity** - Activity feed/audit log

### Enums

- `plan`: starter, pro, enterprise
- `customer_status`: active, churned, trial, suspended
- `user_role`: admin, manager, member, viewer
- `user_status`: active, invited, suspended
- `invoice_status`: paid, pending, overdue, refunded
- `activity_type`: customer_joined, customer_churned, plan_upgraded, plan_downgraded, invoice_paid, user_invited, invoice_overdue

## Development

### Running the App

Both workflows should be started:
1. `artifacts/artifacts/admin-dashboard: web` — Vite dev server
2. `artifacts/artifacts/api-server: API Server` — Express API

### Installing Dependencies

```bash
pnpm install
```

### DB Schema Changes

```bash
pnpm --filter @workspace/db run push
```

### Key Notes

- The `artifacts/lib` directory is a **symlink** to `lib/lib/`. This is required so TypeScript project references resolve correctly.
- The `artifacts/tsconfig.base.json` and `lib/tsconfig.base.json` provide shared TS compiler options.
- The API is accessed from the frontend via `/api` prefix (proxied in production).

## API Endpoints

All endpoints are under `/api`:

- `GET /api/healthz` — Health check
- `GET /api/customers` — List customers
- `POST /api/customers` — Create customer
- `GET /api/customers/:id` — Get customer
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer
- `GET /api/users` — List team users
- `POST /api/users` — Create team user
- `GET /api/invoices` — List invoices
- `POST /api/invoices` — Create invoice
- `GET /api/analytics/overview` — Analytics summary
- `GET /api/activity` — Activity feed
