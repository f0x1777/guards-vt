import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS, SPRING } from '../theme';
import { Scene, Particles } from '../components/Layout';
import { Eyebrow, SplitText } from '../components/AnimatedText';
import { IconShield, IconEye, IconAlert, IconStop, IconFrozen, IconReentry } from '../components/Icons';

// VO: "Our six-stage risk ladder automates your response. From normal operations
//      through watch, partial de-risk, full exit, frozen, and re-entry — the system
//      responds while you stay in control."
export const S06_Risk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(frame, [265, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const stages = [
    { label: 'Normal', c: COLORS.green, trig: 'Drawdown < 5%', I: IconShield },
    { label: 'Watch', c: COLORS.yellow, trig: 'Drawdown 5-10%', I: IconEye },
    { label: 'Partial De-Risk', c: '#f59e0b', trig: 'Drawdown 10-15%', I: IconAlert },
    { label: 'Full Exit', c: COLORS.red, trig: 'Drawdown > 18%', I: IconStop },
    { label: 'Frozen', c: '#8b5cf6', trig: 'Governance override', I: IconFrozen },
    { label: 'Auto Re-Entry', c: COLORS.blue, trig: 'Recovery + cooldown', I: IconReentry },
  ];

  // Active stage sweeps through all 6 over the scene duration
  const active = Math.min(Math.floor(interpolate(frame, [15, 200], [0, 5.99], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 5);

  return (
    <Scene grid>
      <Particles n={25} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: exit }}>
        <Eyebrow text="Automation" delay={1} />
        <SplitText text="6-Stage Risk Ladder" size={38} weight={700} delay={2} stagger={2} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 680 }}>
          {stages.map((st, i) => {
            const sp = spring({ frame: frame - (8 + i * 5), fps, config: SPRING.snappy });
            const on = i <= active;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 8,
                background: on ? `${st.c}0c` : COLORS.panel, border: `1px solid ${on ? `${st.c}30` : COLORS.line}`,
                opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [-12, 0])}px)`,
              }}>
                <st.I size={18} color={on ? st.c : COLORS.textMuted} glow={on} />
                <span style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: on ? st.c : COLORS.textMuted, flex: 1 }}>{st.label}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textSecondary }}>{st.trig}</span>
                {on && <div style={{ width: 5, height: 5, borderRadius: '50%', background: st.c, boxShadow: `0 0 6px ${st.c}88` }} />}
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};
