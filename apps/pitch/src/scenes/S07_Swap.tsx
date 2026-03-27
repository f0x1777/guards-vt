import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Glass, Particles } from '../components/Layout';
import { Eyebrow, SplitText, Counter, FadeIn } from '../components/AnimatedText';
import { IconCheck } from '../components/Icons';
import { AllocBar } from '../components/Charts';

// VO: "Execute policy-gated swaps. RBTC to DOC, bounded by governance,
//      routed through Sovryn. Every action tracked. Every transaction auditable."
export const S07_Swap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [265, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const swapP = spring({ frame: frame - 40, fps, config: { damping: 40, stiffness: 35, mass: 1.5 } });
  const rbtc = interpolate(swapP, [0, 1], [65.8, 58.4]);
  const doc = interpolate(swapP, [0, 1], [34.2, 41.6]);

  // Execution events appear after swap
  const events = [
    { t: '14:32:01', a: 'De-Risk Swap', d: '0.50 RBTC -> 28,650 DOC', s: 'executed', c: COLORS.green },
    { t: '14:32:00', a: 'Policy Check', d: 'Bounds verified', s: 'passed', c: COLORS.green },
    { t: '14:31:58', a: 'Oracle Query', d: 'BTC/USD $67,482', s: 'fresh', c: COLORS.blue },
  ];

  return (
    <Scene grid>
      <Particles n={20} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: exit }}>
        <Eyebrow text="Execute + Track" delay={1} />
        <SplitText text="Bounded Swap Execution" size={36} weight={700} delay={2} stagger={2} />

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Glass w={220} p={18} delay={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>From (De-Risk)</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.text }}>
                <Counter to={0.5} decimals={2} size={22} delay={10} /><span style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 }}>RBTC</span>
              </span>
            </div>
          </Glass>
          <FadeIn delay={16}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${COLORS.accent}10`, border: `1px solid ${COLORS.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </FadeIn>
          <Glass w={220} p={18} delay={14}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>To (Stable)</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.green }}>
                <Counter to={28650} prefix="$" size={22} delay={18} color={COLORS.green} /><span style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 }}>DOC</span>
              </span>
            </div>
          </Glass>
        </div>

        {/* Allocation shift */}
        <FadeIn delay={28}>
          <AllocBar segments={[{ value: rbtc, color: COLORS.accent, label: 'RBTC' }, { value: doc, color: COLORS.blue, label: 'DOC' }]} w={540} h={20} delay={30} />
        </FadeIn>

        {/* Execution trail */}
        <Glass w={640} p={16} delay={60}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.map((e, i) => {
              const p = spring({ frame: frame - (65 + i * 8), fps, config: SPRING.snappy });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < events.length - 1 ? `1px solid ${COLORS.line}` : 'none', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [5, 0])}px)` }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, width: 55 }}>{e.t}</span>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: e.c, boxShadow: `0 0 4px ${e.c}66`, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 600, color: COLORS.text, width: 100 }}>{e.a}</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textSecondary, flex: 1 }}>{e.d}</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 8, fontWeight: 600, color: e.c, padding: '2px 7px', borderRadius: 100, background: `${e.c}0e`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.s}</span>
                </div>
              );
            })}
          </div>
        </Glass>

        <FadeIn delay={95}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 5, background: `${COLORS.green}0c`, border: `1px solid ${COLORS.green}20` }}>
            <IconCheck size={13} color={COLORS.green} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.green, fontWeight: 600 }}>Policy compliant -- Sovryn RBTC to DOC -- Haircut 15%</span>
          </div>
        </FadeIn>
      </div>
    </Scene>
  );
};
