#!/bin/bash
set -e

pnpm install

# Build frontend (outputs to artifacts/artifacts/admin-dashboard/dist/)
pnpm --filter @workspace/admin-dashboard run build

# Build API server (outputs to artifacts/artifacts/api-server/dist/)
pnpm --filter @workspace/api-server run build

# Push database schema
pnpm --filter @workspace/db run push || true
