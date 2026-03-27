import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, SPRING } from '../theme';

interface P { size?: number; color?: string; delay?: number; glow?: boolean }

const Wrap: React.FC<P & { children: React.ReactNode }> = ({ size = 24, color = COLORS.accent, delay = 0, glow = false, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.snappy });
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
      filter: glow ? `drop-shadow(0 0 6px ${color}66)` : undefined,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{children}</svg>
    </div>
  );
};

const s = (c: string) => ({ stroke: c, strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
const f = (c: string, o = '15') => `${c}${o}`;

export const IconShield: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" {...s(c)} fill={f(c)} /><path d="M9 12l2 2 4-4" {...s(c)} /></Wrap>; };
export const IconBolt: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" {...s(c)} fill={f(c)} /></Wrap>; };
export const IconChart: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M3 20h18" {...s(c)} /><path d="M3 17l4-5 3 2 5-6 6 3" {...s(c)} fill="none" /></Wrap>; };
export const IconLink: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" {...s(c)} /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" {...s(c)} /></Wrap>; };
export const IconLock: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><rect x="5" y="11" width="14" height="10" rx="2" {...s(c)} fill={f(c,'10')} /><path d="M8 11V7a4 4 0 018 0v4" {...s(c)} /></Wrap>; };
export const IconEye: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" {...s(c)} fill="none" /><circle cx="12" cy="12" r="3" {...s(c)} fill={f(c,'20')} /></Wrap>; };
export const IconAlert: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...s(c)} fill={f(c,'10')} /><line x1="12" y1="9" x2="12" y2="13" {...s(c)} /><circle cx="12" cy="17" r="1" fill={c} /></Wrap>; };
export const IconStop: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" {...s(c)} fill={f(c,'10')} /><line x1="9" y1="9" x2="15" y2="15" {...s(c)} /><line x1="15" y1="9" x2="9" y2="15" {...s(c)} /></Wrap>; };
export const IconClock: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><circle cx="12" cy="12" r="10" {...s(c)} fill={f(c,'08')} /><path d="M12 6v6l4 2" {...s(c)} /></Wrap>; };
export const IconScissors: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><circle cx="6" cy="6" r="3" {...s(c)} fill="none" /><circle cx="6" cy="18" r="3" {...s(c)} fill="none" /><line x1="20" y1="4" x2="8.12" y2="15.88" {...s(c)} /><line x1="14.47" y1="14.48" x2="20" y2="20" {...s(c)} /></Wrap>; };
export const IconBuilding: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M3 21h18" {...s(c)} /><path d="M5 21V7l7-4 7 4v14" {...s(c)} fill={f(c,'08')} /><path d="M9 21v-4h6v4" {...s(c)} /></Wrap>; };
export const IconGear: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><circle cx="12" cy="12" r="3" {...s(c)} fill={f(c)} /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...s(c)} fill="none" /></Wrap>; };
export const IconKey: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" {...s(c)} fill="none" /></Wrap>; };
export const IconFile: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" {...s(c)} fill={f(c,'08')} /><path d="M14 2v6h6M8 13h8M8 17h8" {...s(c)} /></Wrap>; };
export const IconCheck: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><circle cx="12" cy="12" r="10" {...s(c)} fill={f(c,'10')} /><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Wrap>; };
export const IconLayers: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M12 2L2 7l10 5 10-5-10-5z" {...s(c)} fill={f(c,'12')} /><path d="M2 17l10 5 10-5" {...s(c)} /><path d="M2 12l10 5 10-5" {...s(c)} /></Wrap>; };
export const IconFrozen: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><line x1="12" y1="2" x2="12" y2="22" {...s(c)} /><line x1="2" y1="12" x2="22" y2="12" {...s(c)} /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" {...s(c)} /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" {...s(c)} /><circle cx="12" cy="12" r="3" fill={f(c,'25')} stroke="none" /></Wrap>; };
export const IconReentry: React.FC<P> = (p) => { const c = p.color || COLORS.accent; return <Wrap {...p}><path d="M1 4v6h6" {...s(c)} /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" {...s(c)} fill="none" /></Wrap>; };
