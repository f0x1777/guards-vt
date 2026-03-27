import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Glass, Particles } from '../components/Layout';
import { Eyebrow, SplitText, Counter, FadeIn } from '../components/AnimatedText';
import { IconLayers, IconBolt, IconBuilding } from '../components/Icons';

// VO: "Twelve billion dollar TAM. Four hundred percent Rootstock TVL growth.
//      Three revenue streams: SaaS, execution fees, and enterprise."
export const S09_Market: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [355, 390], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const streams = [
    { I: IconLayers, t: 'SaaS', p: '$500-2K/mo', c: COLORS.accent },
    { I: IconBolt, t: 'Execution', p: '5-15 bps', c: COLORS.blue },
    { I: IconBuilding, t: 'Enterprise', p: 'Custom', c: COLORS.green },
  ];

  return (
    <Scene grid>
      <Particles n={25} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: exit }}>
        <Eyebrow text="Market + Revenue" delay={1} />
        <SplitText text="Bitcoin DeFi is exploding" size={42} weight={700} delay={2} stagger={2} />

        {/* TAM/SAM/SOM */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'TAM', sub: 'DeFi Treasury Mgmt', to: 12, suf: 'B', c: COLORS.accent },
            { label: 'SAM', sub: 'Bitcoin DeFi', to: 2.4, suf: 'B', c: COLORS.blue },
            { label: 'SOM', sub: 'Rootstock + LATAM', to: 180, suf: 'M', c: COLORS.green },
          ].map((t, i) => (
            <Glass key={i} w={260} p={22} delay={8 + i * 8}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: t.c, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600 }}>{t.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>$</span>
                  <Counter to={t.to} decimals={1} size={42} delay={14 + i * 8} color={t.c} />
                  <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: t.c, fontWeight: 600 }}>{t.suf}</span>
                </div>
                <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textSecondary }}>{t.sub}</span>
              </div>
            </Glass>
          ))}
        </div>

        {/* Growth stats */}
        <FadeIn delay={50}>
          <Glass w={600} p={16} delay={52}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { s: '400%', l: 'Rootstock TVL growth' },
                { s: '150+', l: 'DAOs on Bitcoin L2s' },
                { s: '$45B+', l: 'DAO treasuries globally' },
              ].map((x, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.accent }}>{x.s}</span>
                  <span style={{ fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted }}>{x.l}</span>
                </div>
              ))}
            </div>
          </Glass>
        </FadeIn>

        {/* Revenue streams compact */}
        <div style={{ display: 'flex', gap: 14 }}>
          {streams.map((s, i) => {
            const { fps } = useVideoConfig();
            const sp = spring({ frame: frame - (70 + i * 8), fps, config: SPRING.snappy });
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, background: `${s.c}08`, border: `1px solid ${s.c}18`, opacity: sp, transform: `translateY(${interpolate(sp, [0, 1], [6, 0])}px)` }}>
                <s.I size={16} color={s.c} />
                <span style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, color: s.c }}>{s.t}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textMuted }}>{s.p}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};
