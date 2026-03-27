"use client";

import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import type { PlayerRef } from "@remotion/player";

// Import pitch composition + scenes directly
import { S01_Hook } from "@pitch/scenes/S01_Hook";
import { S02_Problem } from "@pitch/scenes/S02_Problem";
import { S03_Solution } from "@pitch/scenes/S03_Solution";
import { S04_Wallet } from "@pitch/scenes/S04_Wallet";
import { S05_Dashboard } from "@pitch/scenes/S05_Dashboard";
import { S06_Risk } from "@pitch/scenes/S06_Risk";
import { S07_Swap } from "@pitch/scenes/S07_Swap";
import { S08_Audit } from "@pitch/scenes/S08_Audit";
import { S09_Market } from "@pitch/scenes/S09_Market";
import { S10_CTA } from "@pitch/scenes/S10_CTA";
import { S, FPS } from "@pitch/theme";

import { Sequence, AbsoluteFill } from "remotion";

const scenes = [
  { id: "hook", C: S01_Hook },
  { id: "problem", C: S02_Problem },
  { id: "solution", C: S03_Solution },
  { id: "wallet", C: S04_Wallet },
  { id: "dashboard", C: S05_Dashboard },
  { id: "risk", C: S06_Risk },
  { id: "swap", C: S07_Swap },
  { id: "audit", C: S08_Audit },
  { id: "market", C: S09_Market },
  { id: "cta", C: S10_CTA },
] as const;

const GuardsPitch: React.FC = () => (
  <AbsoluteFill style={{ background: "#070612" }}>
    {scenes.map(({ id, C }) => {
      const s = S[id as keyof typeof S];
      return (
        <Sequence
          key={id}
          from={s.from}
          durationInFrames={s.dur}
          layout="none"
        >
          <C />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const PitchPlayer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const playerRef = React.useRef<PlayerRef>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#070612",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            color: "#5e5c72",
            fontSize: 14,
          }}
        >
          Loading pitch...
        </span>
      </div>
    );
  }

  return (
    <Player
      ref={playerRef}
      component={GuardsPitch}
      durationInFrames={2700}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={FPS}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(30,29,48,0.5), 0 20px 60px rgba(0,0,0,0.4)",
      }}
      controls
      autoPlay
      loop
      clickToPlay
    />
  );
};
