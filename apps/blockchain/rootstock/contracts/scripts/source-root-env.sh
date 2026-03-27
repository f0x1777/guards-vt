#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
contracts_root="$(cd "${script_dir}/.." && pwd)"
repo_root="$(cd "${contracts_root}/../../../../.." && pwd)"

if [[ -f "${repo_root}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${repo_root}/.env"
fi
