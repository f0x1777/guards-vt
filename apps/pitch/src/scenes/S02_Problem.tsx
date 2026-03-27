import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Glass } from '../components/Layout';
import { SplitText, Eyebrow, FadeIn } from '../components/AnimatedText';
import { LineChart, CRASH_DATA } from '../components/Charts';

// VO: "Most treasuries have zero guardrails. When Bitcoin drops 15% in an hour,
//      there's no automated response. No policy engine. Nothing."
export const S02_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crash = interpolate(frame, [10, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const price = interpolate(crash, [0, 1], [67500, 57375]);
  const exit = interpolate(frame, [175, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visData = CRASH_DATA.slice(0, Math.max(2, Math.ceil(crash * CRASH_DATA.length)));
  const pulse = frame > 40 ? Math.sin(frame * 0.15) * 0.4 + 0.4 : 0;

  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center,${COLORS.red}0a 0%,transparent 70%)`, opacity: pulse, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: exit }}>
        <Eyebrow text="Zero guardrails" delay={2} color={COLORS.red} />
        <SplitText text="BTC drops 15%. Now what?" size={44} weight={700} delay={4} stagger={2} />

        <div style={{ display: 'flex', gap: 18, alignItems: 'stretch' }}>
          {/* Chart */}
          <Glass w={480} p={20} delay={8} border={`${COLORS.red}40`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>BTC/USD</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: crash > 0.3 ? COLORS.red : COLORS.text }}>${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <LineChart data={visData} w={440} h={120} color={crash > 0.3 ? COLORS.red : COLORS.yellow} animate={false} />
            </div>
          </Glass>

          {/* Status */}
          <Glass w={340} p={20} delay={14} border={`${COLORS.red}30`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: 'Automated response', v: 'NONE' },
                { l: 'Policy engine', v: 'NOT CONFIGURED' },
                { l: 'Drawdown limit', v: 'UNDEFINED' },
                { l: 'Recovery plan', v: 'NONE' },
              ].map((row, i) => {
                const rp = spring({ frame: frame - (18 + i * 7), fps, config: SPRING.snappy });
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 5, background: `${COLORS.red}06`, opacity: rp, transform: `translateX(${interpolate(rp, [0, 1], [10, 0])}px)` }}>
                    <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: COLORS.textSecondary }}>{row.l}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{row.v}</span>
                  </div>
                );
              })}
            </div>
          </Glass>
        </div>
      </div>
    </Scene>
  );
};
