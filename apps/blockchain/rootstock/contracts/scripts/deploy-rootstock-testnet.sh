#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
contracts_root="$(cd "${script_dir}/.." && pwd)"
repo_root="$(cd "${contracts_root}/../../../../.." && pwd)"

if [[ -f "${repo_root}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${repo_root}/.env"
fi

"${script_dir}/doctor-rootstock-testnet.sh"

cd "${contracts_root}"

forge script script/DeployGuardedTreasuryVault.s.sol:DeployGuardedTreasuryVault \
  --rpc-url "${ROOTSTOCK_RPC_URL}" \
  --private-key "${ROOTSTOCK_DEPLOYER_PRIVATE_KEY}" \
  --broadcast
