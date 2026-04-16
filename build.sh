#!/bin/bash
set -e

pnpm install

# Build frontend (outputs to artifacts/artifacts/admin-dashboard/dist/)
pnpm --filter @workspace/admin-dashboard run build
