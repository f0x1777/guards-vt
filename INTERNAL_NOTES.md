# Internal Notes

> This document captures internal context, architectural decisions, and development history that are useful for the team but not relevant to the public-facing README. Keep it updated as the project evolves.

---

## Origin

Guards is a treasury operations product focused on bounded execution, clear governance controls, and practical operator workflows.

The public branding is `guards.one`. The internal package namespace remains `anaconda`.

## Why Treasury Risk Management

We evaluated several directions before settling on treasury policy enforcement:

- **Price alerts** — too simple, no execution surface
- **DEX aggregation** — competitive space, oracle usage is shallow
- **Lending protocol** — requires deep on-chain infra, too much scope for a hackathon
- **Treasury autopilot** — needs multiple oracle signals, has a clear execution model, and solves a real problem for DAOs

The insight was that DAOs define risk in percentages but fail when absolute fiat floors are breached. Most treasury tooling is passive. Guards makes it active.

## Key Architectural Decisions

### Chain-agnostic core from day one

We built `packages/core` with zero chain imports. That keeps business logic separate from execution surfaces and lets each chain adapter implement `TreasuryConnector` without refactoring core policy logic.

**Trade-off:** More upfront abstraction work. Worth it for multichain credibility.

### Split custody model

We deliberately avoided the pattern where automated bots spend from the governance multisig. Instead, governance pre-approves a bounded execution bucket. The keeper can only swap within policy limits from the hot wallet. This is safer and more realistic for production DAOs.

### Risk ladder over binary modes

Early versions had a simple "safe/risky" toggle. We replaced it with a 6-stage risk ladder (Normal → Watch → Partial De-Risk → Full Exit → Frozen → Re-Entry) because:
- Gradual escalation reduces unnecessary trading
- Frozen state handles oracle quality degradation
- Re-entry with hysteresis prevents oscillation
- Each stage is explainable to auditors and governance

### Rootstock vault first

We deliberately prioritized a bounded Rootstock vault over deeper protocol-specific automation because it is faster to deploy, easier to audit, and easier to demonstrate under time pressure.

### Static UI → Next.js migration plan

The repository currently serves the operator demo through the static preview flow. A richer Next.js UI exists as a parallel feature branch and is intended to replace the static shell once it lands.

Why that migration still matters:
- component-based architecture
- stricter type safety around the operator surface
- better developer experience for larger UI changes
- a cleaner path to a production-ready build pipeline

Design direction: premium dark theme inspired by [squads.xyz](https://squads.xyz), with electric blue (#3b82f6) accents on deep black (#08090c). The goal is to feel like institutional-grade treasury tooling, not a hackathon project.

## Development Workflow

### Worktree-based feature branches

We use `git worktree` for parallel feature development. Each feature gets its own directory:

```bash
git worktree add ../anaconda-<feature> feature/<branch-name>
```

This allows working on multiple features simultaneously without branch switching.

### PR review flow

- Every feature branch gets a PR against `main`
- Copilot review is requested on each PR
- Review comments are tracked in `NEXT_STEPS.md`

### Monorepo scripts

| Script | Purpose |
|--------|---------|
| `pnpm test` | Run vitest across all packages |
| `pnpm typecheck` | TypeScript strict mode check |
| `pnpm simulate` | End-to-end backend simulation |
| `pnpm export:ui-data` | Generate demo state JSON for UI |
| `pnpm preview` | Backend server + operator demo at :4310 |

## PR History & Review Tracker

| PR | Scope | Status |
|----|-------|--------|
| #1 | Rootstock contract scaffold | Merged |
| #3 | Bounded DeFi adapter surface | Merged |
| #4 | Foundry validation for vault guardrails | Merged |
| #5 | Rootstock wallet and dashboard flow | Merged |
| #7 | Rootstock testnet deploy surface | Merged |
| #8 | Explicit Rootstock wallet onboarding | Merged |
| #9 | Rootstock UI cleanup | Merged |
| #10 | Vault admin and treasury ops | Merged |
| #11 | Deploy env auto-loading | Merged |
| #12 | Vault bootstrap configuration path | Merged |

Detailed review items and their resolution are tracked in [NEXT_STEPS.md](./NEXT_STEPS.md).

## Tooling & AI-Assisted Development

### Skills & MCP integrations

| Tool | Purpose | Config |
|------|---------|--------|
| Nano Banana 2 | Logo/image generation via Gemini 3.1 Flash | `~/tools/nano-banana-2`, key in `~/.nano-banana/.env` |
| 21st.dev Magic | AI-powered UI component generation | MCP in `~/.claude.json` |
| Replicate | Additional AI model access | API token in `.env` |

### Generated assets

- `apps/ui/public/guards-logo.png` — Shield + "GUARDS" wordmark, white on transparent background. Used across navbar, sidebar, footer, and README. Favicon is configured separately as `/guards-icon.svg`.

## Pending Work

See [NEXT_STEPS.md](./NEXT_STEPS.md) for the full backlog. Key priorities:

1. **Deploy `GuardedTreasuryVault`** on Rootstock testnet
2. **Validate Beexo Connect** in the final demo flow
3. **Integrate one real protocol rail** such as Money on Chain or Sovryn
4. **Surface fee and action breakdown** in operator UI
5. **Add CI** for tests and typecheck
6. **Prepare submission assets** for the final demo and pitch

## Team & Contact

This project is maintained by the SOLx-AR team. For questions or collaboration, reach out through the GitHub organization.
