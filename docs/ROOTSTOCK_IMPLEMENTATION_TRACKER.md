# Rootstock Implementation Notes

## Assumptions

- Rootstock is the primary execution chain for this derivation.
- Beexo Connect is the primary wallet UX target.
- EVM compatibility means much of the existing abstracted treasury UI can be reused.
- The original Cardano/Pyth-specific execution path should be treated as legacy unless explicitly ported.

## Proposed Technical Stack

- `apps/ui`: Next.js operator and onboarding UI
- `apps/blockchain/rootstock`: Rootstock-specific contracts and off-chain wiring
- `packages/core`: reusable treasury policy and workflow primitives
- wallet UX: `xo-connect`
- smart contracts: Solidity + Foundry or Hardhat

## First Contract Candidate

`GuardedTreasuryVault.sol`

Suggested state:
- owner / governance role
- operator role
- pause flag
- per-asset limits
- destination allowlist
- optional multisig-compatible execution role

Suggested methods:
- `setOperator(...)`
- `setPaused(...)`
- `setAssetLimit(...)`
- `setDestinationAllowed(...)`
- `executeTransfer(...)`
- `withdraw(...)`

Current status:
- bounded `RBTC` and ERC20 transfer execution is live
- replay protection via `referenceId` is live
- Foundry test coverage validates positive and negative execution paths
- repo-level deploy scripts now wrap Rootstock testnet preflight and broadcast

## First Demo Candidate

1. Connect Beexo wallet.
2. Select company / vault profile.
3. Open Admin.
4. Configure transfer guardrails.
5. Execute a bounded treasury action on Rootstock testnet.
6. Show the action in History / Audit.
