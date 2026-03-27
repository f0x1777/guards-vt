import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';

// Seeded pseudo-random price generator
function genPrices(start: number, end: number, n: number, vol = 0.015, seed = 42): number[] {
  const d: number[] = [start];
  const t = (end - start) / n;
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647 - 0.5; };
  for (let i = 1; i < n; i++) d.push(d[i - 1] + t + r() * d[i - 1] * vol);
  d[d.length - 1] = end;
  return d;
}

export const CRASH_DATA = genPrices(67500, 57375, 60, 0.015, 7);
export const GROWTH_DATA = genPrices(62000, 67500, 60, 0.01, 13);

// ─── Line Chart ─────────────────────────────────────────────────────────────
export const LineChart: React.FC<{
  data: number[]; w?: number; h?: number; color?: string;
  delay?: number; animate?: boolean; grid?: boolean;
}> = ({ data, w = 600, h = 180, color = COLORS.accent, delay = 0, animate = true, grid = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = animate ? spring({ frame: frame - delay, fps, config: { damping: 40, stiffness: 45, mass: 1.5 } }) : 1;

  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: 8 + (1 - (v - min) / rng) * (h - 16),
  }));
  const vis = pts.slice(0, Math.max(2, Math.ceil(p * pts.length)));
  const d = vis.map((pt, i) => `${i ? 'L' : 'M'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const last = vis[vis.length - 1];
  const fillD = vis.length > 1 ? `${d} L${last.x.toFixed(1)},${h} L${vis[0].x.toFixed(1)},${h} Z` : '';
  const pulse = 1 + Math.sin(frame * 0.1) * 0.3;

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs><linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {grid && [0.25, 0.5, 0.75].map((r, i) => <line key={i} x1={0} y1={8 + r * (h - 16)} x2={w} y2={8 + r * (h - 16)} stroke={COLORS.line} strokeWidth="1" strokeDasharray="4 6" opacity={0.4} />)}
      {fillD && <path d={fillD} fill={`url(#g${color.replace('#','')})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" opacity={0.1} />
      {last && <><circle cx={last.x} cy={last.y} r={5 * pulse} fill={color} opacity={0.25} /><circle cx={last.x} cy={last.y} r={3} fill={color} stroke={COLORS.bg} strokeWidth={1.5} /></>}
    </svg>
  );
};

// ─── Donut Chart ────────────────────────────────────────────────────────────
export const Donut: React.FC<{
  segments: { value: number; color: string; label: string }[];
  size?: number; thick?: number; delay?: number;
}> = ({ segments, size = 140, thick = 16, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 35, stiffness: 45, mass: 1.2 } });
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thick) / 2, circ = 2 * Math.PI * r, cx = size / 2;
  let acc = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={COLORS.line} strokeWidth={thick} opacity={0.4} />
        {segments.map((seg, i) => {
          const ratio = seg.value / total;
          const len = circ * ratio * p, off = circ * (acc / total) * p;
          acc += seg.value;
          return <circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={seg.color} strokeWidth={thick} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-off} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${seg.color}44)` }} />;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {segments.map((seg, i) => {
          const sp = spring({ frame: frame - delay - 8 - i * 4, fps, config: SPRING.snappy });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [8, 0])}px)` }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textSecondary }}>{seg.label}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: COLORS.text }}>{((seg.value / total) * 100).toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Allocation bar ─────────────────────────────────────────────────────────
export const AllocBar: React.FC<{
  segments: { value: number; color: string; label: string }[];
  w?: number; h?: number; delay?: number;
}> = ({ segments, w = 600, h = 24, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SPRING.smooth });
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ width: w, height: h, borderRadius: h / 2, background: COLORS.line, overflow: 'hidden', display: 'flex', opacity: interpolate(p, [0, 0.05, 1], [0, 1, 1]) }}>
        {segments.map((seg, i) => <div key={i} style={{ width: (seg.value / total) * w * p, height: '100%', background: seg.color }} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: 1, background: seg.color }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted }}>{seg.label} {((seg.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
