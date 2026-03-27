# GUARDS ONE -- 90s Pitch Video Script
## DoraHacks Rootstock Track | 1920x1080 @ 30fps | 2700 frames

---

## VOICEOVER SCRIPT (~195 words, ritmo profesional)

```
[0:00-0:07] HOOK
Three point two billion dollars.
That's what DAOs lost to treasury mismanagement last year.

[0:07-0:14] PROBLEM
Most treasuries have zero guardrails. When Bitcoin drops fifteen
percent in an hour, there's no automated response. No policy
engine. Nothing.

[0:14-0:22] SOLUTION REVEAL
Guards changes that. A treasury control plane for Bitcoin DeFi
on Rootstock — where governance defines the rules, and smart
contracts enforce them.

[0:22-0:27] DEMO: WALLET
Connect in seconds with Beexo. LATAM-first onboarding, native
Rootstock support.

[0:27-0:35] DEMO: DASHBOARD + POLICY
Your entire treasury at a glance. Define portfolio floors,
drawdown thresholds, oracle guards — every bound enforced
on-chain.

[0:35-0:45] DEMO: RISK LADDER
Our six-stage risk ladder automates your response.
From normal operations through watch, partial de-risk,
full exit, frozen, and re-entry — the system responds
while you stay in control.

[0:45-0:55] DEMO: SWAP + EXECUTION
Execute policy-gated swaps. RBTC to DOC, bounded by governance,
routed through Sovryn. Every action tracked. Every transaction
auditable.

[0:55-0:65] DEMO: AUDIT
Replay protection. On-chain events. Complete policy compliance.
No operator can exceed their bounds.

[0:65-0:78] MARKET + MODEL
Twelve billion dollar TAM in DeFi treasury management.
Four hundred percent Rootstock TVL growth year over year.
Three revenue streams: SaaS subscriptions, execution fees,
and enterprise.

[0:78-0:90] CTA
Stop watching your treasury.
Start guarding it.
Guards dot one.
Built on Rootstock. Powered by Pyth. Wallet by Beexo.
```

---

## SCENE MAP (frame-accurate)

| # | Scene | Frames | Time | VO Cue |
|---|-------|--------|------|--------|
| 1 | Hook | 0-210 | 0:00-0:07 | "$3.2B lost..." |
| 2 | Problem | 210-420 | 0:07-0:14 | "Zero guardrails..." |
| 3 | Solution | 420-660 | 0:14-0:22 | "Guards changes that..." |
| 4 | Wallet | 660-810 | 0:22-0:27 | "Connect with Beexo..." |
| 5 | Dashboard | 810-1050 | 0:27-0:35 | "Treasury at a glance..." |
| 6 | Risk | 1050-1350 | 0:35-0:45 | "Six-stage risk ladder..." |
| 7 | Swap | 1350-1650 | 0:45-0:55 | "Policy-gated swaps..." |
| 8 | Audit | 1650-1950 | 0:55-1:05 | "Replay protection..." |
| 9 | Market | 1950-2340 | 1:05-1:18 | "$12B TAM..." |
| 10 | CTA | 2340-2700 | 1:18-1:30 | "Stop watching..." |

**Total: 2700 frames = 90 seconds. Zero gaps.**

---

## PRODUCTION NOTES

### Voiceover Direction
- Tone: Confident, authoritative, not hype
- Pace: Measured but dynamic — slow on stats, faster on features
- Reference: Y Combinator demo day energy + institutional finance gravitas
- Language: English with clarity for international/LATAM audience

### Visual Rhythm
- Every scene has content appearing from frame 2-4 (no dead time)
- Exit fades are 25-30 frames max (sub-second)
- Spring configs: snappy (damping 18, stiffness 200) for UI reveals
- Charts animate in sync with voiceover mentions

### Audio Layers (post-production)
1. Voiceover (primary)
2. Ambient synth pad (low, continuous)
3. Bass hits on stat reveals and logo impacts
4. Subtle UI click sounds on wallet connect steps

### Commands
```bash
cd apps/pitch
pnpm dev          # Preview
pnpm build        # Render -> out/guards-pitch.mp4
```
