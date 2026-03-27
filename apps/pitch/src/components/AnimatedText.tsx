import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';

// ─── Word-by-word reveal ────────────────────────────────────────────────────
export const SplitText: React.FC<{
  text: string; size?: number; color?: string; weight?: number;
  delay?: number; stagger?: number; font?: string; center?: boolean;
}> = ({ text, size = 64, color = COLORS.text, weight = 700, delay = 0, stagger = 3, font = FONTS.sans, center = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: size * 0.28, justifyContent: center ? 'center' : 'flex-start' }}>
      {text.split(' ').map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: SPRING.snappy });
        return (
          <span key={i} style={{
            fontSize: size, color, fontFamily: font, fontWeight: weight,
            letterSpacing: '-0.02em', lineHeight: 1.15, display: 'inline-block',
            opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
            filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

// ─── Typewriter ─────────────────────────────────────────────────────────────
export const Typewriter: React.FC<{
  text: string; size?: number; color?: string; font?: string;
  delay?: number; speed?: number; cursor?: boolean;
}> = ({ text, size = 20, color = COLORS.textSecondary, font = FONTS.mono, delay = 0, speed = 2, cursor = true }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const n = Math.min(Math.floor(f * speed), text.length);
  return (
    <span style={{ fontSize: size, color, fontFamily: font, letterSpacing: '0.02em' }}>
      {text.slice(0, n)}
      {cursor && n < text.length && frame % 18 < 10 && (
        <span style={{ color: COLORS.accent, fontWeight: 300 }}>|</span>
      )}
    </span>
  );
};

// ─── Fade-in ────────────────────────────────────────────────────────────────
export const FadeIn: React.FC<{
  children: React.ReactNode; delay?: number; dir?: 'up' | 'down' | 'left' | 'right' | 'none'; dist?: number;
}> = ({ children, delay = 0, dir = 'up', dist = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  const d = { up: [0, dist], down: [0, -dist], left: [dist, 0], right: [-dist, 0], none: [0, 0] }[dir];
  return (
    <div style={{
      opacity: p,
      transform: `translate(${interpolate(p, [0, 1], [d[0], 0])}px,${interpolate(p, [0, 1], [d[1], 0])}px)`,
      filter: `blur(${interpolate(p, [0, 1], [6, 0])}px)`,
    }}>{children}</div>
  );
};

// ─── Counter ────────────────────────────────────────────────────────────────
export const Counter: React.FC<{
  to: number; from?: number; prefix?: string; suffix?: string;
  decimals?: number; size?: number; delay?: number; color?: string;
}> = ({ to, from = 0, prefix = '', suffix = '', decimals = 0, size = 48, delay = 0, color = COLORS.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.heavy });
  const v = interpolate(p, [0, 1], [from, to]);
  return (
    <span style={{
      fontSize: size, fontFamily: FONTS.mono, fontWeight: 700,
      color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
    }}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
};

// ─── Eyebrow ────────────────────────────────────────────────────────────────
export const Eyebrow: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text, delay = 0, color = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.snappy });
  return (
    <div style={{
      fontSize: 13, fontFamily: FONTS.mono, fontWeight: 500, color,
      textTransform: 'uppercase', letterSpacing: '0.18em',
      opacity: p, transform: `translateY(${interpolate(p, [0, 1], [8, 0])}px)`,
    }}>{text}</div>
  );
};
