#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ ! -x "$project_root/.venv/bin/uvicorn" || ! -d "$project_root/sentinel-demo/node_modules" ]]; then
  echo "Demo dependencies are missing. Run scripts/setup-demo.sh while online first." >&2
  exit 1
fi
cleanup() {
  if [[ -n "${api_pid:-}" ]]; then kill "$api_pid" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM
(cd "$project_root/demo-api" && "$project_root/.venv/bin/uvicorn" main:app --host 127.0.0.1 --port 8000) &
api_pid=$!
echo "Starting OverFlow demo. Open the local address printed by the frontend."
(cd "$project_root/sentinel-demo" && npm run dev -- --host 127.0.0.1)
