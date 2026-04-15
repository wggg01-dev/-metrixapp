#!/bin/bash
set -e

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "artifacts/artifacts/admin-dashboard/node_modules" ]; then
  pnpm install
fi

# Push database schema
pnpm --filter @workspace/db run push || true

# Start Vite dev server in background on port 3002 (avoids conflict with artifact workflows on 3000/3001)
VITE_PORT=3002 PORT=3002 pnpm --filter @workspace/admin-dashboard run dev &
VITE_PID=$!

# Build and start API server on port 5000 (proxies to Vite on 3002)
VITE_PORT=3002 PORT=5000 pnpm --filter @workspace/api-server run dev

# If API server exits, kill Vite too
kill $VITE_PID 2>/dev/null || true
