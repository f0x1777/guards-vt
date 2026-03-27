# Rootstock Deploy Runbook

## Goal

Deploy the first `GuardedTreasuryVault` instance to Rootstock testnet with a reproducible command path.

## Required Environment

Set these values in the repo-level `.env`:

- `ROOTSTOCK_RPC_URL`
- `ROOTSTOCK_DEPLOYER_PRIVATE_KEY`
- `ROOTSTOCK_GOVERNANCE_PRIVATE_KEY` (required unless `ROOTSTOCK_DEPLOYER_PRIVATE_KEY` derives `ROOTSTOCK_GOVERNANCE_ADDRESS`)
- `ROOTSTOCK_GOVERNANCE_ADDRESS`
- `ROOTSTOCK_OPERATOR_ADDRESS`

## Preflight

```bash
pnpm rootstock:contract:doctor
```

This verifies:
- repo-level `.env` is loaded automatically when present
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

## Bootstrap Configuration

After deployment, set these env vars:

- `ROOTSTOCK_GUARDED_VAULT_ADDRESS`
- `ROOTSTOCK_ALLOWED_ASSETS`
- `ROOTSTOCK_ALLOWED_DESTINATIONS`
- `ROOTSTOCK_LIMIT_ASSETS`
- `ROOTSTOCK_LIMIT_VALUES`

Bootstrap configuration uses the governance signer.

- If `ROOTSTOCK_GOVERNANCE_PRIVATE_KEY` is set, it must match `ROOTSTOCK_GOVERNANCE_ADDRESS`.
- If it is not set, the script requires `ROOTSTOCK_DEPLOYER_PRIVATE_KEY` to derive the same address as `ROOTSTOCK_GOVERNANCE_ADDRESS`.

Then run:

```bash
pnpm rootstock:contract:configure:testnet
```

This executes:

- `script/BootstrapGuardedTreasuryVault.s.sol:BootstrapGuardedTreasuryVault`

and configures:

- allowed assets
- allowed destinations
- per-asset transfer caps

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
