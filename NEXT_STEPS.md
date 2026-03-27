# ROOTSTOCK IMPLEMENTATION TRACKER

This is the canonical tracker for Guards on Rootstock.

## Rules
- Update this file in the same commit that changes the underlying work.
- Keep items concrete and testable.
- If something is blocked, note the blocker inline.

## Immediate Product Definition
- [x] Establish the repo as a Rootstock / Beexo product surface
- [x] Remove migration-oriented positioning from the README and planning surface
- [x] Remove inherited local `.env` from the repo
- [x] Replace outdated chain-specific copy in the UI with Rootstock / Beexo positioning
- [ ] Decide the exact MVP scope for DoraHacks submission

## Rootstock Smart Contract Track
- [x] Define the first contract scope for Rootstock
- [x] Decide the first contract scope: `GuardedTreasuryVault` as a bounded treasury vault / guarded transfer executor
- [x] Create `apps/blockchain/rootstock/contracts`
- [x] Add an initial Foundry scaffold for Rootstock
- [x] Add guardrail-focused Foundry tests for the first contract scaffold
- [x] Install Foundry in the real dev environment and validate the scaffold
- [x] Keep the Foundry vendor footprint minimal and ignore generated artifacts
- [x] Implement bounded `RBTC` / ERC20 transfer and withdrawal execution in `GuardedTreasuryVault`
- [x] Add a reproducible Rootstock testnet deploy surface for the first vault contract
- [x] Add a reproducible post-deploy bootstrap/configuration path for the first vault contract
- [x] Require a governance signer for post-deploy vault bootstrap configuration
- [x] Clarify in-repo that `GuardedTreasuryVault` is a bounded vault, not the full policy engine
- [x] Document the pending contract architecture and operating model for Money on Chain / Sovryn execution
- [ ] Deploy at least one contract on Rootstock testnet
- [ ] Document deployed addresses and networks
- [ ] Decide whether adapter allowlists live in the vault or in a standalone registry
- [ ] Implement `MoneyOnChainAdapter` with bounded mint / redeem entrypoints
- [ ] Implement `SovrynSwapAdapter` with bounded swap entrypoints
- [ ] Add end-to-end Foundry tests for vault -> adapter -> protocol -> vault settlement

## Beexo Connect Track
- [x] Install and integrate `xo-connect`
- [x] Replace demo-only wallet flows with Beexo-first EIP-1193 connection
- [x] Keep the visible dashboard wallet flow Rootstock / EVM-first
- [x] Add an explicit wallet onboarding selector for Beexo, existing EVM wallets, and demo mode
- [ ] Add wallet onboarding flow for LATAM-oriented users
- [x] Show connected wallet state in the dashboard and landing CTA
- [ ] Validate a demonstrable Beexo flow in the final demo

## Treasury UX / Product
- [x] Keep the company / vault profile model
- [x] Keep treasury actions: send, withdraw, bridge, on/off ramp
- [x] Turn disabled treasury actions into real staged flows where possible
- [x] Add vault administration / multisig member management UI for the Rootstock version
- [x] Define whether one wallet can manage multiple company vaults in the MVP

## DeFi Integrations
- [x] Scaffold protocol adapter surfaces for Money on Chain and Sovryn
- [x] Add fail-closed tests for Rootstock protocol adapter scaffolds
- [x] Evaluate Money on Chain for stable / BTC-denominated treasury flows
- [x] Replace the Money on Chain scaffold with executable `mintDoc` / `redeemFreeDoc` calldata preparation
- [ ] Evaluate Tropykus for treasury lending / collateral management use cases
- [ ] Evaluate Sovryn for swaps or treasury movement workflows
- [ ] Pick one real Rootstock-native integration for the demo

## Demo / Submission Deliverables
- [ ] Public GitHub repo with updated docs
- [ ] Functional demo link
- [ ] 5-minute demo video + pitch
- [ ] Slide deck
- [ ] DoraHacks submission copy

## Cleanup
- [ ] Remove or quarantine legacy package surfaces that will not be reused
- [ ] Remove obsolete docs that no longer match the current product direction
- [ ] Rename internal package / workspace labels only if it will not slow down delivery
