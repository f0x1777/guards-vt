<p align="center">
  <img src="apps/ui/public/guards-logo.png" width="280" alt="Guards" />
</p>

<p align="center"><strong>Treasury protection adapted for Rootstock and Beexo Connect.</strong></p>

<p align="center">
  <code>guards.one</code> is being adapted into a Bitcoin DeFi treasury control plane for <code>RSK / Rootstock</code>, with wallet UX powered by <code>Beexo Connect</code> and a multichain policy engine that can manage bounded treasury actions across EVM rails.
</p>

---

## Current Status

This repository is a derived copy of the original `guards.one` hackathon codebase.

The original product was built around Cardano and Pyth. This derivation exists to adapt the reusable parts of the system for the following tracks:
- `Rootstock Track`
- `Beexo Connect Track`

This means the repository is currently in **migration mode**:
- reusable policy and UI surfaces are being kept
- Cardano/Pyth-specific product messaging has been removed from the public surface
- Rootstock / Beexo-specific implementation is the next priority

## Product Direction

The Rootstock version of Guards is a treasury operations and protection workflow for DAOs, treasury companies, and on-chain organizations that hold:
- `RBTC`
- Bitcoin-correlated assets on Rootstock
- stables such as `DOC` / `USDRIF`
- strategic treasury positions that require bounded execution and clear governance controls

Instead of framing the product around a single oracle or a single chain, this version of Guards focuses on:
1. policy-based treasury controls
2. bounded automated execution
3. Bitcoin DeFi integrations on Rootstock
4. wallet UX and onboarding via Beexo Connect

## What We Intend To Reuse

The following pieces are still useful in the adaptation:
- shared risk / policy engine concepts
- treasury workflow and dashboard UX
- bounded execution model
- company / vault profile handling
- mock and replay tooling for demos
- multichain account and wallet abstraction patterns

## What Must Change For Rootstock

The Cardano/Pyth live path is not the target for this repo anymore.

The new implementation must pivot to:
- Rootstock smart contracts deployed on `RSK`
- EVM-compatible wallet flows
- Beexo Connect (`xo-connect`) for frictionless wallet onboarding
- Rootstock-native DeFi integrations where possible:
  - `RBTC`
  - `Money on Chain`
  - `Tropykus`
  - `Sovryn`
- policy-driven treasury actions over Rootstock assets and rails

## Wallet UX Direction

The primary wallet UX path for this adaptation is `Beexo Connect` over an `EIP-1193` provider model.

In practice that means:
- Rootstock testnet is the default target network
- the app should request or add the Rootstock chain in the wallet
- demo fallback stays available for fast product iteration

## Minimal MVP For The Track

A credible Rootstock + Beexo MVP should include:
1. wallet connection with Beexo Connect
2. one deployed contract on Rootstock testnet or mainnet
3. one real treasury workflow in the UI
4. one demonstrable policy-based action or safeguarded treasury operation
5. a clear demo flow for LATAM-oriented UX

## Suggested Product Reframe

A pragmatic version of Guards for this track is:

**Guards One: treasury operations and protected execution for Bitcoin DeFi organizations on Rootstock.**

Potential MVP capabilities:
- treasury vault creation and administration
- bounded transfers and withdrawals
- policy-based movement between `RBTC` and stable assets
- treasury health views and account controls
- wallet-first UX using Beexo Connect

## Quick Start

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm --dir apps/ui dev
```

- UI dev server: `http://localhost:3000`
- Runtime baseline: `Node >= 24.0.0`

## Environment

Copy `.env.example` to `.env` and fill the Rootstock / Beexo values you actually need.

```bash
cp .env.example .env
```

See:
- [docs/ROOTSTOCK_ADAPTATION_PLAN.md](./docs/ROOTSTOCK_ADAPTATION_PLAN.md)
- [docs/ROOTSTOCK_IMPLEMENTATION_TRACKER.md](./docs/ROOTSTOCK_IMPLEMENTATION_TRACKER.md)

## Notes

- This repository intentionally does **not** falsify timestamps, authorship, or file metadata.
- Legacy Cardano/Pyth code may still exist internally while the adaptation is in progress, but it is no longer the public product direction of this derivation.
