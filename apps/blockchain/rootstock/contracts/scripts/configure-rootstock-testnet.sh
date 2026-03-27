#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
contracts_root="$(cd "${script_dir}/.." && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/source-root-env.sh"

if [[ -z "${ROOTSTOCK_GUARDED_VAULT_ADDRESS:-}" ]]; then
  echo "Missing required env var: ROOTSTOCK_GUARDED_VAULT_ADDRESS" >&2
  exit 1
fi

"${script_dir}/doctor-rootstock-testnet.sh"

cd "${contracts_root}"

forge script script/BootstrapGuardedTreasuryVault.s.sol:BootstrapGuardedTreasuryVault \
  --rpc-url "${ROOTSTOCK_RPC_URL}" \
  --private-key "${ROOTSTOCK_DEPLOYER_PRIVATE_KEY}" \
  --broadcast
