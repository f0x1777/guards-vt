import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Center, Glass, Particles } from '../components/Layout';
import { Eyebrow, SplitText, Typewriter, FadeIn } from '../components/AnimatedText';

// VO: "Connect in seconds with Beexo. LATAM-first onboarding, native Rootstock support."
export const S04_Wallet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const steps = [
    { t: 'Detecting Beexo Connect...', d: 5 },
    { t: 'EIP-1193 provider found', d: 22 },
    { t: 'Connected: 0x7a3f...b21c', d: 38 },
    { t: 'Network: Rootstock Testnet (31)', d: 50 },
  ];
  return (
    <Scene grid>
      <Particles n={30} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: exit }}>
        <Eyebrow text="Connect" delay={1} />
        <SplitText text="Beexo Wallet" size={38} weight={700} delay={2} stagger={2} />
        <Glass w={560} p={22} delay={6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => {
              const p = spring({ frame: frame - s.d, fps, config: SPRING.snappy });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [8, 0])}px)` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 3 ? COLORS.green : COLORS.accent, boxShadow: `0 0 4px ${i === 3 ? COLORS.green : COLORS.accent}66` }} />
                  <Typewriter text={s.t} size={14} delay={s.d} speed={5} cursor={false} />
                </div>
              );
            })}
          </div>
        </Glass>
        <FadeIn delay={70}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 18px', borderRadius: 100, background: `${COLORS.green}0e`, border: `1px solid ${COLORS.green}22` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.green, boxShadow: `0 0 5px ${COLORS.green}88` }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.green, fontWeight: 600 }}>LATAM-first onboarding via Beexo</span>
          </div>
        </FadeIn>
      </div>
    </Scene>
  );
};
