import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Particles, Logo, Divider } from '../components/Layout';
import { SplitText, FadeIn } from '../components/AnimatedText';
import { IconShield, IconBolt, IconChart, IconLink } from '../components/Icons';

// VO: "Guards changes that. A treasury control plane for Bitcoin DeFi on Rootstock
//      — where governance defines the rules, and smart contracts enforce them."
export const S03_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impact = 40;
  const impP = spring({ frame: frame - impact, fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });
  const shock = interpolate(frame - impact, [0, 28], [0, 650], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shockO = interpolate(frame - impact, [0, 28], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [205, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pills = [
    { I: IconShield, t: 'Policy governance', c: COLORS.accent },
    { I: IconBolt, t: 'Bounded execution', c: COLORS.blue },
    { I: IconChart, t: 'Oracle-aware', c: COLORS.green },
    { I: IconLink, t: 'Rootstock native', c: COLORS.yellow },
  ];

  return (
    <Scene grid>
      <Particles n={60} />
      {frame > impact && <div style={{ position: 'absolute', width: shock, height: shock, borderRadius: '50%', border: `2px solid ${COLORS.accent}`, opacity: shockO, pointerEvents: 'none' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: exit }}>
        {frame < impact && <SplitText text="What if your treasury could protect itself?" size={40} weight={600} color={COLORS.textSecondary} delay={2} stagger={2} />}
        {frame >= impact && (<>
          <div style={{ opacity: impP, transform: `scale(${interpolate(impP, [0, 1], [1.4, 1])})` }}>
            <Logo size={500} />
          </div>
          <Divider w={180} />
          <FadeIn delay={10} dist={8}>
            <span style={{ fontSize: 22, fontFamily: FONTS.sans, fontWeight: 600, color: COLORS.text, textAlign: 'center' }}>
              Treasury control plane for <span style={{ color: COLORS.accent }}>Bitcoin DeFi</span> on Rootstock
            </span>
          </FadeIn>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            {pills.map((p, i) => {
              const pp = spring({ frame: frame - impact - 20 - i * 5, fps, config: SPRING.snappy });
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 100, background: `${p.c}0c`, border: `1px solid ${p.c}20`, opacity: pp, transform: `translateY(${interpolate(pp, [0, 1], [8, 0])}px)` }}>
                  <p.I size={14} color={p.c} /><span style={{ fontSize: 12, fontFamily: FONTS.sans, fontWeight: 600, color: COLORS.text }}>{p.t}</span>
                </div>
              );
            })}
          </div>
        </>)}
      </div>
    </Scene>
  );
};
