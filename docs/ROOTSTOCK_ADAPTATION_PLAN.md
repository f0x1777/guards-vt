# Rootstock + Beexo Adaptation Plan

## Goal

Adapt `guards.one` from a Cardano/Pyth treasury-protection prototype into a Rootstock-native treasury operations product that can compete in:
- `Rootstock Track`
- `Beexo Connect Track`

## Product Thesis

The most credible pivot is not “copy the Cardano app onto Rootstock.”

The right move is to keep the useful product primitives:
- treasury control
- bounded execution
- company / vault operations
- multisig-aware workflows
- operator dashboard UX

Then re-anchor them around Bitcoin DeFi and wallet UX:
- `RBTC`
- Rootstock-native DeFi rails
- Beexo Connect onboarding and wallet interaction

## Recommended MVP

### Core narrative

**Guards One is a treasury operating system for Bitcoin DeFi organizations on Rootstock.**

### Demonstrable MVP

1. Beexo wallet connection
2. Company / vault dashboard
3. Treasury admin view
4. Treasury actions:
- send
- withdraw
- bridge
- on/off ramp placeholders or staged flows
5. One deployed Rootstock contract
6. One real integration with a Rootstock protocol or treasury rail

## Smart Contract Scope

Do not start with a giant automation protocol.

Start with one deployable contract that is easy to demonstrate.

### Best option

`GuardedTreasuryVault`

Responsibilities:
- holds treasury-controlled assets
- stores governance / operator roles
- enforces bounded actions
- logs or emits structured execution events
- supports staged treasury operations under policy limits

### What the contract can enforce in MVP

- approved operator roles
- max transfer amount per action
- destination allowlist
- pause / emergency stop
- asset allowlist
- vault ownership and admin rotation

This is far easier to deploy and explain than trying to rebuild the whole Cardano oracle-driven path under time pressure.

## Beexo Connect Scope

The Beexo track is a UX multiplier. Use it.

### Minimum useful integration

- connect wallet
- show network / wallet identity
- let the user enter the dashboard with a real provider
- sign one demonstrable action

### Better version

- onboarding CTA on landing
- connect from landing and dashboard
- clear connected state in the top-right profile area
- chain-aware flow if wallet is on Rootstock testnet vs wrong network

## Rootstock DeFi Integration Strategy

Pick one real integration. Do not spread effort across all protocols.

### Recommended order

1. `Money on Chain`
Reason:
- strong treasury narrative
- stable / BTC-denominated relevance
- easy to explain for DAOs and treasury operators

2. `Sovryn`
Reason:
- swap / execution story
- DeFi-native positioning

3. `Tropykus`
Reason:
- lending / collateral use cases if time remains

## UI Adaptation

### Keep
- landing shell
- dashboard shell
- company / vault profile model
- treasury actions surface
- history / audit / admin layout

### Replace
- Cardano wording
- Pyth-specific product claims
- preprod-only warnings
- Cardano execution copy

### Add
- Rootstock network labels
- Beexo wallet connection states
- Rootstock vault creation language
- Rootstock treasury action narratives

## Delivery Order

### Phase 1
- sanitize branding and docs
- remove Cardano/Pyth public positioning
- prepare Rootstock tracker

### Phase 2
- Beexo connect integration
- Rootstock dashboard flows
- connect / wrong-network / connected states

### Phase 3
- Rootstock contract setup and deploy
- document contract address and demo steps

### Phase 4
- one DeFi integration
- final demo and submission assets

## Decision Boundary

If time is short, prioritize in this order:
1. Beexo Connect working in UI
2. one deployed Rootstock contract
3. one treasury workflow in dashboard
4. one real Rootstock integration
5. visual polish
