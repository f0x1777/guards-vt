import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  AbsoluteFill,
} from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';

// ─── Scene wrapper: fills the entire video frame ────────────────────────────
export const Scene: React.FC<{
  children: React.ReactNode;
  grid?: boolean;
}> = ({ children, grid = false }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, background: COLORS.gradientRadial, pointerEvents: 'none' }} />
      {/* Grid */}
      {grid && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3,
          backgroundImage: `linear-gradient(${COLORS.line}22 1px,transparent 1px),linear-gradient(90deg,${COLORS.line}22 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      )}
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.55) 100%)', pointerEvents: 'none' }} />
      {/* Content — centered */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: 60, zIndex: 1,
      }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ─── Absolute-fill centered wrapper for Sequence sub-scenes ─────────────────
export const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
    {children}
  </AbsoluteFill>
);

// ─── Glass panel ────────────────────────────────────────────────────────────
export const Glass: React.FC<{
  children: React.ReactNode;
  w?: number | string;
  p?: number;
  delay?: number;
  border?: string;
  style?: React.CSSProperties;
}> = ({ children, w = 'auto', p = 28, delay = 0, border, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = spring({ frame: frame - delay, fps, config: SPRING.snappy });
  return (
    <div style={{
      width: w, padding: p,
      background: `linear-gradient(135deg, ${COLORS.panel}ee, ${COLORS.panelHover}aa)`,
      border: `1px solid ${border || COLORS.line}`,
      borderRadius: 14, backdropFilter: 'blur(16px)',
      opacity: prog,
      transform: `translateY(${interpolate(prog, [0, 1], [14, 0])}px) scale(${interpolate(prog, [0, 1], [0.97, 1])})`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// ─── Particles ──────────────────────────────────────────────────────────────
export const Particles: React.FC<{ n?: number; color?: string }> = ({ n = 30, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const s = i * 137.508;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${(s * 7.3) % 100}%`, top: `${(s * 3.7) % 100}%`,
            width: 1 + (s % 3), height: 1 + (s % 3), borderRadius: '50%',
            background: color, opacity: 0.12 + Math.sin(frame * 0.03 + s) * 0.08,
            transform: `translate(${Math.sin(frame * 0.02 * (0.3 + s % 0.7) + s) * 18}px, ${Math.sin(frame * 0.015 + s * 2) * 14}px)`,
          }} />
        );
      })}
    </div>
  );
};

// ─── Logo ───────────────────────────────────────────────────────────────────
export const Logo: React.FC<{ size?: number; delay?: number }> = ({ size = 200, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.bouncy });
  const glow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.2, 0.5]);
  return (
    <div style={{
      opacity: p,
      transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
      filter: `drop-shadow(0 0 ${30 * glow}px ${COLORS.accentGlow})`,
    }}>
      <Img src={staticFile('guards-logo.png')} style={{ width: size, height: 'auto', objectFit: 'contain' }} />
    </div>
  );
};

// ─── Progress bar ───────────────────────────────────────────────────────────
export const Bar: React.FC<{
  value: number; w?: number; h?: number; color?: string; delay?: number;
}> = ({ value, w = 400, h = 5, color = COLORS.accent, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.heavy });
  return (
    <div style={{ width: w, height: h, borderRadius: h / 2, background: COLORS.line, overflow: 'hidden', opacity: interpolate(p, [0, 0.05, 1], [0, 1, 1]) }}>
      <div style={{
        width: w * value * p, height: '100%', borderRadius: h / 2,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        boxShadow: `0 0 10px ${color}44`,
      }} />
    </div>
  );
};

// ─── Divider ────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ delay?: number; w?: number }> = ({ delay = 0, w = 140 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  return (
    <div style={{
      width: w * p, height: 1, margin: '10px 0', opacity: p,
      background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
    }} />
  );
};
