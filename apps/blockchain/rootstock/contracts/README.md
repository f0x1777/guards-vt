# Rootstock Contracts

This is the source of truth for Rootstock smart contracts in Guards.

## First contract

`GuardedTreasuryVault.sol`

MVP responsibilities:
- governance ownership
- operator role
- pause / unpause
- asset allowlist
- destination allowlist
- per-asset max transfer amount
- bounded transfer execution
- bounded withdrawal execution
- replay protection via `referenceId`
- native `RBTC` and ERC20 custody execution

Current implementation note:
- guardrails and role checks are implemented
- transfer and withdrawal execution are live for bounded `RBTC` and ERC20 movements
- Foundry deploy script and tests are live
- protocol-specific DeFi execution stays outside the vault and should be routed through bounded adapters

## Tooling choice

The recommended stack for this repo is `Foundry`, because it is fast to scaffold, test, and deploy for an EVM-compatible target like Rootstock.

The repository vendors only the minimal `forge-std` source and license files needed to compile and run the local test suite. Generated artifacts stay ignored under `cache/`, `out/`, and `broadcast/`.

## Next steps

1. Fill the Rootstock deploy env vars in the repo `.env`
2. Run `pnpm rootstock:contract:doctor`
3. Run `pnpm rootstock:contract:deploy:testnet`
4. Set the deployed vault address and bootstrap allowlists / limits in `.env`
5. Run `pnpm rootstock:contract:configure:testnet`
6. Route a bounded Money on Chain or Sovryn action through an operator flow

## Validation status

- `forge test` passes locally against live bounded transfer/withdrawal execution
- the vault supports `RBTC` via `address(0)` and ERC20 transfers with destination + asset allowlists
- the bootstrap script configures initial allowed assets, destinations, and transfer limits from env arrays
