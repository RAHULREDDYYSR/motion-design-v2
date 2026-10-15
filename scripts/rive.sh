#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -n "${RIVE_CLI_PATH:-}" && -x "$RIVE_CLI_PATH" ]]; then
  exec "$RIVE_CLI_PATH" "$@"
fi
if [[ -x "$project_root/.tools/bin/rive" ]]; then
  exec "$project_root/.tools/bin/rive" "$@"
fi
if command -v rive >/dev/null 2>&1; then
  exec rive "$@"
fi
printf '%s\n' 'Rive CLI is not installed. See README.md for setup and required network access.' >&2
exit 127
