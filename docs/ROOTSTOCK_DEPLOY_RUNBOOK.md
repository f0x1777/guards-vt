# Rootstock Deploy Runbook

## Goal

Deploy the first `GuardedTreasuryVault` instance to Rootstock testnet with a reproducible command path.

## Required Environment

Set these values in the repo-level `.env`:

- `ROOTSTOCK_RPC_URL`
- `ROOTSTOCK_DEPLOYER_PRIVATE_KEY`
- `ROOTSTOCK_GOVERNANCE_ADDRESS`
- `ROOTSTOCK_OPERATOR_ADDRESS`

## Preflight

```bash
pnpm rootstock:contract:doctor
```

This verifies:
- env vars are present
- `forge` is installed
- `cast` is installed
- the deployer address can be derived from the private key

## Deploy

```bash
pnpm rootstock:contract:deploy:testnet
```

This executes the Foundry script:

- `script/DeployGuardedTreasuryVault.s.sol:DeployGuardedTreasuryVault`

against:

- `ROOTSTOCK_RPC_URL`

using:

- `ROOTSTOCK_DEPLOYER_PRIVATE_KEY`

## Expected Output

After a successful run, record:

- deployed contract address
- tx hash
- network
- governance address
- operator address

Those values should be copied back into:

- `.env`
- `NEXT_STEPS.md`
- the eventual demo / submission notes

## Notes

- The vault already supports bounded `RBTC` and ERC20 transfers.
- The first post-deploy action should be governance configuration:
  - allow assets
  - allow destinations
  - set per-asset limits
- Protocol-specific actions such as `Money on Chain` stay off-chain until a keeper/operator submits the prepared call path.
