import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Glass, Particles } from '../components/Layout';
import { Eyebrow, SplitText, FadeIn } from '../components/AnimatedText';
import { IconKey, IconFile, IconCheck, IconBuilding, IconGear, IconLink } from '../components/Icons';

// VO: "Replay protection. On-chain events. Complete policy compliance.
//      No operator can exceed their bounds."
// Also covers architecture (governance -> execution -> protocol)
export const S08_Audit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [265, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const auditCards = [
    { l: 'Replay Protection', d: 'Unique reference IDs prevent duplicates', I: IconKey, c: COLORS.accent },
    { l: 'On-Chain Events', d: 'Every transfer emits verifiable events', I: IconFile, c: COLORS.blue },
    { l: 'Policy Compliance', d: 'All actions bounded by governance rules', I: IconCheck, c: COLORS.green },
  ];

  const layers = [
    { l: 'Governance', items: ['Safe Multisig', 'Policy Rules'], c: COLORS.accent, I: IconBuilding },
    { l: 'Execution', items: ['GuardedTreasuryVault', 'Oracle Guards'], c: COLORS.blue, I: IconGear },
    { l: 'Protocol', items: ['Sovryn', 'Money on Chain'], c: COLORS.green, I: IconLink },
  ];

  return (
    <Scene grid>
      <Particles n={20} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: exit }}>
        <Eyebrow text="Audit + Architecture" delay={1} />
        <SplitText text="Every bound enforced" size={36} weight={700} delay={2} stagger={2} />

        {/* Audit cards */}
        <div style={{ display: 'flex', gap: 14 }}>
          {auditCards.map((c, i) => (
            <Glass key={i} w={270} p={20} delay={8 + i * 7}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: `${c.c}0c`, border: `1px solid ${c.c}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.I size={20} color={c.c} delay={12 + i * 7} glow />
                </div>
                <span style={{ fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700, color: COLORS.text }}>{c.l}</span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{c.d}</span>
              </div>
            </Glass>
          ))}
        </div>

        {/* Compact 3-layer architecture */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {layers.map((l, i) => {
            const lp = spring({ frame: frame - (55 + i * 10), fps, config: SPRING.snappy });
            return (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, background: `${l.c}08`, border: `1px solid ${l.c}18`, opacity: lp, transform: `translateY(${interpolate(lp, [0, 1], [8, 0])}px)` }}>
                  <l.I size={16} color={l.c} />
                  <div>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 600, color: l.c }}>{l.l}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted }}>{l.items.join(' / ')}</div>
                  </div>
                </div>
                {i < 2 && <div style={{ opacity: lp }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};
