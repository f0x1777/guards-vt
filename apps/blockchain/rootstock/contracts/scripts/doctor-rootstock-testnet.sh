#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/source-root-env.sh"

required_vars=(
  ROOTSTOCK_RPC_URL
  ROOTSTOCK_DEPLOYER_PRIVATE_KEY
  ROOTSTOCK_GOVERNANCE_ADDRESS
  ROOTSTOCK_OPERATOR_ADDRESS
)

missing=0
for name in "${required_vars[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: ${name}" >&2
    missing=1
  fi
done

if ! command -v forge >/dev/null 2>&1; then
  echo "Missing required binary: forge" >&2
  missing=1
fi

if ! command -v cast >/dev/null 2>&1; then
  echo "Missing required binary: cast" >&2
  missing=1
fi

if [[ -n "${ROOTSTOCK_GUARDED_VAULT_ADDRESS:-}" ]]; then
  extra_required_vars=(
    ROOTSTOCK_ALLOWED_ASSETS
    ROOTSTOCK_ALLOWED_DESTINATIONS
    ROOTSTOCK_LIMIT_ASSETS
    ROOTSTOCK_LIMIT_VALUES
  )

  for name in "${extra_required_vars[@]}"; do
    if [[ -z "${!name:-}" ]]; then
      echo "Missing required bootstrap env var: ${name}" >&2
      missing=1
    fi
  done
fi

if [[ "${missing}" -ne 0 ]]; then
  exit 1
fi

deployer_address="$(cast wallet address --private-key "${ROOTSTOCK_DEPLOYER_PRIVATE_KEY}")"

echo "Rootstock testnet deployment surface looks ready."
echo "RPC: ${ROOTSTOCK_RPC_URL}"
echo "Deployer: ${deployer_address}"
echo "Governance: ${ROOTSTOCK_GOVERNANCE_ADDRESS}"
echo "Operator: ${ROOTSTOCK_OPERATOR_ADDRESS}"
