<p align="center">
  <img src="apps/ui/public/guards-logo.png" width="280" alt="Guards" />
</p>

<p align="center"><strong>Treasury operations and protected execution for Rootstock.</strong></p>

<p align="center">
  <code>guards.one</code> is a treasury control plane for <code>RSK / Rootstock</code>, with wallet UX powered by <code>Beexo Connect</code> and bounded treasury actions across EVM rails.
</p>

---

## Product Direction

Guards is a treasury operations and protection workflow for DAOs, treasury companies, and on-chain organizations that hold:
- `RBTC`
- Bitcoin-correlated assets on Rootstock
- stables such as `DOC` / `USDRIF`
- strategic treasury positions that require bounded execution and clear governance controls

The product focuses on:
1. policy-based treasury controls
2. bounded automated execution
3. Bitcoin DeFi integrations on Rootstock
4. wallet UX and onboarding via Beexo Connect

## Wallet UX Direction

The primary wallet UX path is `Beexo Connect` over an `EIP-1193` provider model.

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

Today the Rootstock vault surface already supports:
- bounded `RBTC` and ERC20 treasury transfers
- governance-only withdrawals
- destination and asset allowlists
- per-asset execution caps
- replay protection for staged treasury actions

Current status clarification:
- the deployed-contract surface today is a **guarded treasury vault**
- it is **not yet** the full policy engine or automated DeFi execution layer
- the pending contract architecture is documented in [docs/ROOTSTOCK_CONTRACT_ARCHITECTURE.md](./docs/ROOTSTOCK_CONTRACT_ARCHITECTURE.md)

## Bounded Automation Direction

Automatic swaps are possible on Rootstock, but the product should frame them as bounded treasury actions, not arbitrary trading.

The intended model is:
- governance allowlists the protocol route
- governance caps notional and slippage
- an operator or keeper prepares a bounded action
- the vault contract enforces limits before execution

The first real protocol target should be either `Money on Chain` or `Sovryn`, depending on which yields the most credible demo path fastest.
The current implementation priority is `Money on Chain`, with executable `RBTC <-> DOC` calldata preparation wired in the off-chain adapter layer.

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
- [docs/ROOTSTOCK_PRODUCT_PLAN.md](./docs/ROOTSTOCK_PRODUCT_PLAN.md)
- [docs/ROOTSTOCK_IMPLEMENTATION_TRACKER.md](./docs/ROOTSTOCK_IMPLEMENTATION_TRACKER.md)
- [docs/ROOTSTOCK_DEPLOY_RUNBOOK.md](./docs/ROOTSTOCK_DEPLOY_RUNBOOK.md)
- [docs/ROOTSTOCK_CONTRACT_ARCHITECTURE.md](./docs/ROOTSTOCK_CONTRACT_ARCHITECTURE.md)

## Rootstock Deploy Surface

Once `.env` is filled, the first contract can be validated and deployed with:

```bash
pnpm rootstock:contract:doctor
pnpm rootstock:contract:deploy:testnet
```

## Notes

- This repository intentionally does **not** falsify timestamps, authorship, or file metadata.
- The product direction in this repository is Rootstock, Beexo Connect, and bounded treasury execution.
