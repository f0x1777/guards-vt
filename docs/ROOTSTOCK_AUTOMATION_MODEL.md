# Rootstock Automation Model

## Can Guards Support Automatic Swaps On Rootstock?

Yes, but only as bounded treasury automation.

The correct model is not "open-ended automated trading".
It is:
- governance-defined routes
- governance-defined max notional
- explicit operator / keeper role
- auditable prepared actions
- a vault contract that can reject anything outside the policy envelope

## Practical MVP

The first credible Rootstock MVP should do this:
1. connect a Beexo / EIP-1193 wallet
2. create or point to a `GuardedTreasuryVault`
3. define one or two allowlisted treasury routes
4. execute one bounded action on Rootstock testnet

## First Integration Recommendation

1. `Money on Chain`
- good fit for treasury protection language
- stable / Bitcoin-denominated treasury framing is easier to explain

2. `Sovryn`
- useful if the demo needs a more explicit swap path
- still should remain bounded by policy and notional caps

## Execution Model

A simple execution model for the demo:
- `governance`: configures routes, caps, operator role, pause
- `operator`: stages a transfer / rebalance / swap intent
- `keeper`: optional automation layer if we need timed or policy-driven execution
- `contract`: enforces policy bounds before value leaves the vault

## Why This Matters

This keeps the product coherent with its treasury positioning.
The user is delegating controlled execution, not surrendering arbitrary trading authority.
