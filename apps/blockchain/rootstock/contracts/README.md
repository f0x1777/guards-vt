# Rootstock Contracts

This is the source of truth for Rootstock smart contracts in the adapted Guards repo.

## First contract

`GuardedTreasuryVault.sol`

MVP responsibilities:
- governance ownership
- operator role
- pause / unpause
- asset allowlist
- destination allowlist
- per-asset max transfer amount
- bounded transfer execution
- bounded withdrawal execution

## Tooling choice

The recommended stack for this repo is `Foundry`, because it is fast to scaffold, test, and deploy for an EVM-compatible target like Rootstock.

## Next steps

1. Install Foundry in the actual dev environment
2. Add RPC and deployer env vars for Rootstock testnet
3. Write deployment script
4. Deploy the first contract to Rootstock testnet
