# Rootstock Offchain

This directory is the Rootstock-specific offchain surface for the adapted version of Guards.

## Scope
- `Beexo Connect` / `EIP-1193` wallet flows
- Rootstock testnet chain switching helpers
- transaction builders for the `GuardedTreasuryVault`
- protocol adapters for bounded treasury actions
- operator / keeper flows for staged execution

## Current Direction

The initial offchain model is intentionally conservative:
- wallet UX first through Beexo Connect
- one vault contract on Rootstock testnet
- bounded actions only
- one real protocol integration for the demo

## Protocol Direction

Two candidates are currently modeled:
- `Money on Chain`: treasury movement between Bitcoin-correlated value and stable rails
- `Sovryn`: guarded swap / rebalance paths

The product should not present itself as an arbitrary trading bot.
A credible automation model on Rootstock is:
1. governance configures allowlisted routes and notional caps
2. an operator or keeper prepares a bounded intent
3. the vault contract enforces role checks and spending limits
4. the UI shows intent + result for auditability

## Files
- `src/types.ts`: common types for bounded treasury action intents
- `src/money-on-chain.ts`: first live adapter, preparing `mintDoc` / `redeemFreeDoc` calldata
- `src/sovryn.ts`: alternate adapter scaffold
