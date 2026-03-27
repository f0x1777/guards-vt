# Rootstock Product Plan

## Goal

Build `guards.one` as a treasury operations and protected execution product for organizations operating on Rootstock.

The product combines:
- treasury administration
- bounded execution
- wallet-first operator flows
- Bitcoin DeFi integrations

## Product Thesis

Guards is not an arbitrary trading bot.

Guards is a treasury control plane that lets governance define:
- who can operate
- which assets are allowed
- which destinations are allowed
- how much can move per action
- which protocol rails are acceptable

Operators and keepers then execute only inside those bounds.

## Core Product Surface

### Vault administration

- governance role
- operator role
- pause / unpause
- asset allowlist
- destination allowlist
- per-asset execution caps
- replay-safe treasury actions

### Treasury operations

- send
- withdraw
- bridge
- onramp
- offramp
- bounded protocol actions

### Wallet UX

- Beexo Connect as the primary onboarding path
- standard EVM wallet fallback
- explicit wrong-network handling for Rootstock testnet

## Minimal MVP

1. Connect wallet through Beexo Connect
2. Enter the operator dashboard
3. Select a company / vault profile
4. Review treasury policy and vault members
5. Stage or execute a bounded treasury action
6. Show the resulting action in history and audit views
7. Demonstrate one deployed contract on Rootstock testnet

## Smart Contract Scope

### First contract

`GuardedTreasuryVault`

Responsibilities:
- hold treasury-controlled assets
- enforce governance and operator permissions
- enforce bounded transfers and withdrawals
- enforce destination and asset allowlists
- enforce per-asset transfer caps
- emit auditable treasury events

### Post-deploy configuration

The first usable testnet flow is:
1. deploy `GuardedTreasuryVault`
2. configure allowed assets
3. configure allowed destinations
4. configure transfer caps
5. fund the vault
6. execute a bounded action

## DeFi Integration Strategy

Pick one real Rootstock-native integration first.

### Recommended order

1. `Money on Chain`
   - strongest treasury narrative
   - clean `RBTC <-> DOC` story
   - simple to explain to judges and operators

2. `Sovryn`
   - strong swap / execution story
   - useful once the bounded execution path is stable

3. `Tropykus`
   - lending and collateral management if time remains

## Delivery Priorities

### Phase 1
- Rootstock contract deploy path
- post-deploy bootstrap path
- wallet onboarding

### Phase 2
- bounded treasury action demo
- first protocol integration
- polished demo flow

### Phase 3
- submission assets
- video
- slides
- hosted demo

## Decision Boundary

If time is short, prioritize in this order:
1. one deployed Rootstock contract
2. working Beexo Connect flow
3. one demonstrable bounded treasury action
4. one real protocol rail
5. visual polish
