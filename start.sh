#!/bin/bash

# Source Replit environment so pnpm/node are available
source ~/.bashrc 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "artifacts/artifacts/admin-dashboard/node_modules" ]; then
  pnpm install
fi

# Push database schema
pnpm --filter @workspace/db run push || true

# Cleanup function — kill all child processes on exit
cleanup() {
  echo "Shutting down..."
  kill "$VITE_PID" 2>/dev/null || true
  kill "$API_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGTERM SIGINT

# Start Vite dev server with auto-restart
start_vite() {
  while true; do
    echo "[start.sh] Starting Vite dev server on port 3002..."
    VITE_PORT=3002 PORT=3002 pnpm --filter @workspace/admin-dashboard run dev &
    VITE_PID=$!
    wait "$VITE_PID" 2>/dev/null
    EXIT_CODE=$?
    if [ "$EXIT_CODE" -eq 0 ] || [ "$EXIT_CODE" -eq 130 ] || [ "$EXIT_CODE" -eq 143 ]; then
      echo "[start.sh] Vite exited cleanly."
      break
    fi
    echo "[start.sh] Vite crashed (exit $EXIT_CODE). Restarting in 2s..."
    sleep 2
  done
}

# Start API server with auto-restart (rebuilds on each restart to pick up any changes)
start_api() {
  while true; do
    echo "[start.sh] Building and starting API server on port 5000..."
    VITE_PORT=3002 PORT=5000 pnpm --filter @workspace/api-server run dev &
    API_PID=$!
    wait "$API_PID" 2>/dev/null
    EXIT_CODE=$?
    if [ "$EXIT_CODE" -eq 0 ] || [ "$EXIT_CODE" -eq 130 ] || [ "$EXIT_CODE" -eq 143 ]; then
      echo "[start.sh] API server exited cleanly."
      break
    fi
    echo "[start.sh] API server crashed (exit $EXIT_CODE). Restarting in 2s..."
    sleep 2
  done
}

start_vite &
start_api &

# Wait for both background loops to finish
wait
