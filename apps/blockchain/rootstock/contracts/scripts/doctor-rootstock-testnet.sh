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
bootstrap_signer_address="${deployer_address}"
normalized_rootstock_governance_address="$(printf '%s' "${ROOTSTOCK_GOVERNANCE_ADDRESS}" | tr '[:upper:]' '[:lower:]')"

if [[ -n "${ROOTSTOCK_GUARDED_VAULT_ADDRESS:-}" ]]; then
  governance_signer_private_key="${ROOTSTOCK_GOVERNANCE_PRIVATE_KEY:-}"

  if [[ -n "${governance_signer_private_key}" ]]; then
    governance_signer_address="$(cast wallet address --private-key "${governance_signer_private_key}")"
    normalized_governance_signer_address="$(printf '%s' "${governance_signer_address}" | tr '[:upper:]' '[:lower:]')"
    if [[ "${normalized_governance_signer_address}" != "${normalized_rootstock_governance_address}" ]]; then
      echo "ROOTSTOCK_GOVERNANCE_PRIVATE_KEY does not match ROOTSTOCK_GOVERNANCE_ADDRESS" >&2
      exit 1
    fi
    bootstrap_signer_address="${governance_signer_address}"
  else
    normalized_deployer_address="$(printf '%s' "${deployer_address}" | tr '[:upper:]' '[:lower:]')"
    if [[ "${normalized_deployer_address}" != "${normalized_rootstock_governance_address}" ]]; then
      echo "Bootstrap requires governance signing. Set ROOTSTOCK_GOVERNANCE_PRIVATE_KEY or use a deployer key that matches ROOTSTOCK_GOVERNANCE_ADDRESS." >&2
      exit 1
    fi
  fi
fi

echo "Rootstock testnet deployment surface looks ready."
echo "RPC: ${ROOTSTOCK_RPC_URL}"
echo "Deployer: ${deployer_address}"
echo "Governance: ${ROOTSTOCK_GOVERNANCE_ADDRESS}"
echo "Operator: ${ROOTSTOCK_OPERATOR_ADDRESS}"
if [[ -n "${ROOTSTOCK_GUARDED_VAULT_ADDRESS:-}" ]]; then
  echo "Bootstrap signer: ${bootstrap_signer_address}"
fi
