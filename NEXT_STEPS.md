# ROOTSTOCK IMPLEMENTATION TRACKER

This is the canonical tracker for the Rootstock / Beexo derivation of Guards.

## Rules
- Update this file in the same commit that changes the underlying work.
- Keep items concrete and testable.
- If something is blocked, note the blocker inline.

## Immediate Product Reframe
- [x] Create a clean derivative repo for the Rootstock / Beexo track
- [x] Remove public-facing Cardano / Pyth positioning from the README and planning surface
- [x] Remove inherited local `.env` from the derived repo
- [ ] Replace remaining Cardano / Pyth copy in the UI with Rootstock / Beexo positioning
- [ ] Decide the exact MVP scope for DoraHacks submission

## Rootstock Smart Contract Track
- [x] Define the first contract scope for Rootstock
- [x] Decide the first contract scope: `GuardedTreasuryVault` as a bounded treasury vault / guarded transfer executor
- [x] Create `apps/blockchain/rootstock/contracts`
- [x] Add an initial Foundry scaffold for Rootstock
- [ ] Install Foundry in the real dev environment and validate the scaffold
- [ ] Deploy at least one contract on Rootstock testnet
- [ ] Document deployed addresses and networks

## Beexo Connect Track
- [ ] Install and integrate `xo-connect`
- [x] Add a first Beexo / EIP-1193 Rootstock wallet scaffold in the UI
- [ ] Add wallet onboarding flow for LATAM-oriented users
- [ ] Show connected wallet state in the dashboard and landing CTA
- [ ] Validate a demonstrable Beexo flow in the final demo

## Treasury UX / Product
- [ ] Keep the company / vault profile model
- [ ] Keep treasury actions: send, withdraw, bridge, on/off ramp
- [ ] Turn disabled treasury actions into real staged flows where possible
- [ ] Add vault administration / multisig member management UI for the Rootstock version
- [ ] Define whether one wallet can manage multiple company vaults in the MVP

## DeFi Integrations
- [ ] Evaluate Money on Chain for stable / BTC-denominated treasury flows
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
- [ ] Remove or quarantine legacy Cardano-only package surfaces that will not be reused
- [ ] Remove obsolete docs that refer to the old Cardano/Pyth submission path
- [ ] Rename internal package / workspace labels only if it will not slow down delivery
