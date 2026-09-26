#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python3 -m venv "$project_root/.venv"
"$project_root/.venv/bin/python" -m pip install -r "$project_root/demo-api/requirements.txt"
(cd "$project_root/sentinel-demo" && npm ci)
echo "OverFlow demo dependencies are ready. Use scripts/start-demo.sh to launch."
