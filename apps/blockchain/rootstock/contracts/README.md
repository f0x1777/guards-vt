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

Current implementation note:
- guardrails and role checks are scaffolded
- deployment script and tests are scaffolded
- transfer and withdrawal execution intentionally revert until real custody semantics are implemented

## Tooling choice

The recommended stack for this repo is `Foundry`, because it is fast to scaffold, test, and deploy for an EVM-compatible target like Rootstock.

## Next steps

1. Add RPC and deployer env vars for Rootstock testnet
2. Wire real asset movement and vault custody semantics
3. Deploy the first contract to Rootstock testnet

## Validation status

- `forge test` passes locally against the current scaffold
- execution paths remain intentionally fail-closed until real vault custody is wired
