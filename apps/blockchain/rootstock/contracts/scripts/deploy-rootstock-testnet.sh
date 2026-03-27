#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
contracts_root="$(cd "${script_dir}/.." && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/source-root-env.sh"

"${script_dir}/doctor-rootstock-testnet.sh"

cd "${contracts_root}"

forge script script/DeployGuardedTreasuryVault.s.sol:DeployGuardedTreasuryVault \
  --rpc-url "${ROOTSTOCK_RPC_URL}" \
  --private-key "${ROOTSTOCK_DEPLOYER_PRIVATE_KEY}" \
  --broadcast
