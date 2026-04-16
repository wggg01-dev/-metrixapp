#!/bin/bash

# Source Replit environment so pnpm/node are available
source ~/.bashrc 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "artifacts/artifacts/admin-dashboard/node_modules" ]; then
  pnpm install
fi

# Cleanup function — kill frontend process on exit
cleanup() {
  echo "Shutting down..."
  kill "$APP_PID" 2>/dev/null || true
  exit 0
}
trap cleanup SIGTERM SIGINT

# Start frontend app with auto-restart
start_app() {
  while true; do
    echo "[start.sh] Starting frontend app on port 8080..."
    VITE_PORT=8080 PORT=8080 pnpm --filter @workspace/admin-dashboard run dev &
    APP_PID=$!
    wait "$APP_PID" 2>/dev/null
    EXIT_CODE=$?
    if [ "$EXIT_CODE" -eq 0 ] || [ "$EXIT_CODE" -eq 130 ] || [ "$EXIT_CODE" -eq 143 ]; then
      echo "[start.sh] Frontend app exited cleanly."
      break
    fi
    echo "[start.sh] Frontend app crashed (exit $EXIT_CODE). Restarting in 2s..."
    sleep 2
  done
}

start_app
