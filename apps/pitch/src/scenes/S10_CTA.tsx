import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Particles, Logo, Divider } from '../components/Layout';
import { SplitText, FadeIn } from '../components/AnimatedText';

// VO: "Stop watching your treasury. Start guarding it.
//      Guards dot one. Built on Rootstock. Powered by Pyth. Wallet by Beexo."
export const S10_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.15, 0.5]);
  const breathe = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.98, 1.02]);

  return (
    <Scene>
      <Particles n={60} />
      <div style={{
        position: 'absolute', width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle,${COLORS.accentGlow} 0%,transparent 70%)`,
        opacity: glow, filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ transform: `scale(${breathe})` }}>
          <Logo size={300} delay={2} />
        </div>
        <Divider delay={12} w={200} />
        <SplitText text="Stop watching your treasury." size={38} weight={600} color={COLORS.textSecondary} delay={18} stagger={3} />
        <SplitText text="Start guarding it." size={50} weight={800} color={COLORS.accent} delay={36} stagger={4} />
        <FadeIn delay={55}>
          <div style={{ marginTop: 8, padding: '11px 34px', borderRadius: 10, background: `linear-gradient(135deg,${COLORS.accent}18,${COLORS.accent}08)`, border: `1px solid ${COLORS.accent}35` }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 600, color: COLORS.accent, letterSpacing: '0.04em' }}>guards.one</span>
          </div>
        </FadeIn>
        <FadeIn delay={75}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 4 }}>
            {[{ l: 'Built on', n: 'Rootstock' }, { l: 'Powered by', n: 'Pyth' }, { l: 'Wallet by', n: 'Beexo' }].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{p.l}</span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textSecondary, fontWeight: 600 }}>{p.n}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={95}>
          <div style={{ marginTop: 2, padding: '5px 18px', borderRadius: 100, background: `${COLORS.accent}0a`, border: `1px solid ${COLORS.accent}16` }}>
            <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: COLORS.accent, fontWeight: 600 }}>DoraHacks -- Rootstock Track</span>
          </div>
        </FadeIn>
      </div>
    </Scene>
  );
};
