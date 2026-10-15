#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$project_root/work"
curl --fail --show-error --location --max-time 60 \
  https://releases.rive.app/cli/install.sh \
  --output "$project_root/work/rive-install.sh"
printf '%s\n' 'Downloaded work/rive-install.sh. Inspect its supported installation options before running it.'
