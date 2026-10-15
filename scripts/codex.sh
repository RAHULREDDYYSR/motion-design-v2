#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
# Pass the portable repository marketplace's current absolute path explicitly.
# This does not alter the user's Codex home or authentication.
marketplace_source="$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$project_root")"
exec codex --cd "$project_root" \
  -c 'marketplaces.motion-design-v2.source_type="local"' \
  -c "marketplaces.motion-design-v2.source=$marketplace_source" \
  "$@"
