import React from 'react';
import { Composition, Sequence, AbsoluteFill } from 'remotion';
import { FPS, S } from './theme';

import { S01_Hook } from './scenes/S01_Hook';
import { S02_Problem } from './scenes/S02_Problem';
import { S03_Solution } from './scenes/S03_Solution';
import { S04_Wallet } from './scenes/S04_Wallet';
import { S05_Dashboard } from './scenes/S05_Dashboard';
import { S06_Risk } from './scenes/S06_Risk';
import { S07_Swap } from './scenes/S07_Swap';
import { S08_Audit } from './scenes/S08_Audit';
import { S09_Market } from './scenes/S09_Market';
import { S10_CTA } from './scenes/S10_CTA';

const all = [
  { id: 'hook', C: S01_Hook },
  { id: 'problem', C: S02_Problem },
  { id: 'solution', C: S03_Solution },
  { id: 'wallet', C: S04_Wallet },
  { id: 'dashboard', C: S05_Dashboard },
  { id: 'risk', C: S06_Risk },
  { id: 'swap', C: S07_Swap },
  { id: 'audit', C: S08_Audit },
  { id: 'market', C: S09_Market },
  { id: 'cta', C: S10_CTA },
] as const;

const GuardsPitch: React.FC = () => (
  <AbsoluteFill style={{ background: '#070612' }}>
    {all.map(({ id, C }) => {
      const s = S[id as keyof typeof S];
      return (
        <Sequence key={id} from={s.from} durationInFrames={s.dur} layout="none">
          <C />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="GuardsPitch" component={GuardsPitch} durationInFrames={2700} fps={FPS} width={1920} height={1080} />
    {all.map(({ id, C }) => {
      const s = S[id as keyof typeof S];
      return <Composition key={id} id={id.charAt(0).toUpperCase() + id.slice(1)} component={C} durationInFrames={s.dur} fps={FPS} width={1920} height={1080} />;
    })}
  </>
);
