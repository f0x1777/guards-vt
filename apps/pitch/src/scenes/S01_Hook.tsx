import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Particles } from '../components/Layout';
import { Counter, FadeIn } from '../components/AnimatedText';

// VO: "Three point two billion dollars. That's what DAOs lost to treasury mismanagement last year."
export const S01_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [175, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Big number slams in immediately
  const numP = spring({ frame: frame - 2, fps, config: SPRING.bouncy });

  return (
    <Scene>
      <Particles n={30} color={COLORS.red} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, opacity: exit }}>
        {/* Giant stat */}
        <div style={{
          opacity: numP,
          transform: `scale(${interpolate(numP, [0, 1], [0.6, 1])})`,
          filter: `blur(${interpolate(numP, [0, 1], [12, 0])}px)`,
        }}>
          <Counter to={3.2} prefix="$" suffix="B" decimals={1} size={120} delay={2} color={COLORS.red} />
        </div>

        <FadeIn delay={25} dist={15}>
          <span style={{
            fontSize: 26, fontFamily: FONTS.sans, fontWeight: 600,
            color: COLORS.textSecondary, textAlign: 'center', lineHeight: 1.5,
            maxWidth: 700,
          }}>
            lost to treasury mismanagement last year
          </span>
        </FadeIn>

        {/* Accent line */}
        <FadeIn delay={50}>
          <div style={{ width: 60, height: 2, borderRadius: 1, background: COLORS.red, boxShadow: `0 0 12px ${COLORS.red}66` }} />
        </FadeIn>

        <FadeIn delay={65} dist={10}>
          <span style={{
            fontSize: 16, fontFamily: FONTS.mono, fontWeight: 500,
            color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.16em',
          }}>
            DAOs -- Treasury Companies -- On-chain Organizations
          </span>
        </FadeIn>
      </div>
    </Scene>
  );
};
