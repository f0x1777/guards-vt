import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Glass, Particles } from '../components/Layout';
import { Eyebrow, SplitText, Counter, FadeIn } from '../components/AnimatedText';
import { LineChart, Donut, GROWTH_DATA } from '../components/Charts';
import { IconLock, IconEye, IconAlert, IconStop, IconClock, IconScissors } from '../components/Icons';

// VO: "Your entire treasury at a glance. Define portfolio floors, drawdown thresholds,
//      oracle guards — every bound enforced on-chain."
export const S05_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [205, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const metrics = [
    { l: 'Liquid Value', to: 2.84, pre: '$', suf: 'M', c: COLORS.accent },
    { l: 'Stable Ratio', to: 34.2, pre: '', suf: '%', c: COLORS.blue },
    { l: 'Drawdown', to: -3.8, pre: '', suf: '%', c: COLORS.yellow },
    { l: 'Oracle', to: 0, c: COLORS.green, custom: 'LIVE' },
  ];

  const policies = [
    { l: 'Floor', v: '$2.0M', I: IconLock, c: COLORS.accent },
    { l: 'Watch', v: '-5%', I: IconEye, c: COLORS.yellow },
    { l: 'De-Risk', v: '-10%', I: IconAlert, c: '#f59e0b' },
    { l: 'Full Exit', v: '-18%', I: IconStop, c: COLORS.red },
    { l: 'Stale', v: '120s', I: IconClock, c: COLORS.blue },
    { l: 'Haircut', v: '15%', I: IconScissors, c: COLORS.green },
  ];

  return (
    <Scene grid>
      <Particles n={25} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: exit }}>
        <Eyebrow text="Dashboard + Policy" delay={1} />
        <SplitText text="Treasury at a Glance" size={36} weight={700} delay={2} stagger={2} />

        {/* Metrics row */}
        <div style={{ display: 'flex', gap: 14 }}>
          {metrics.map((m, i) => (
            <Glass key={i} w={200} p={14} delay={6 + i * 4}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.l}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: m.c }}>
                  {m.custom || <Counter to={m.to} prefix={m.pre} suffix={m.suf} decimals={1} size={24} delay={10 + i * 4} color={m.c} />}
                </span>
              </div>
            </Glass>
          ))}
        </div>

        {/* Chart + Donut + Policy grid */}
        <div style={{ display: 'flex', gap: 14 }}>
          <Glass w={380} p={14} delay={28}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: COLORS.green, boxShadow: `0 0 4px ${COLORS.green}` }} />
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textSecondary }}>Pyth BTC/USD</span>
                </div>
                <Counter from={62000} to={67482} size={14} delay={32} />
              </div>
              <LineChart data={GROWTH_DATA} w={352} h={88} color={COLORS.green} delay={30} />
            </div>
          </Glass>

          <Glass w={200} p={14} delay={35}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Allocation</span>
            <Donut segments={[{ value: 65.8, color: COLORS.accent, label: 'RBTC' }, { value: 34.2, color: COLORS.blue, label: 'DOC' }]} size={100} thick={12} delay={38} />
          </Glass>

          {/* Policy mini-grid */}
          <Glass w={280} p={14} delay={42}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Policy Bounds</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {policies.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 5, background: `${p.c}08` }}>
                  <p.I size={14} color={p.c} delay={48 + i * 3} />
                  <div>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 9, color: COLORS.textMuted }}>{p.l}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: COLORS.text }}>{p.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </div>
    </Scene>
  );
};
