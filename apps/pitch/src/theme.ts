export const COLORS = {
  bg: '#070612', bgSoft: '#0c0b18', panel: '#0f0e1c', panelHover: '#14132a',
  surface: '#121120', line: '#1e1d30', lineSoft: '#16152a',
  text: '#f0eef8', textSecondary: '#9896aa', textMuted: '#5e5c72',
  accent: '#7c6ff7', accentHover: '#9b8fff',
  accentMuted: 'rgba(124,111,247,0.09)', accentGlow: 'rgba(124,111,247,0.35)',
  blue: '#3b82f6', green: '#22c55e', yellow: '#f0bf5f', red: '#ef6f6c',
  gradientRadial: 'radial-gradient(ellipse at center,rgba(124,111,247,0.12) 0%,transparent 70%)',
} as const;

export const FONTS = {
  sans: 'Manrope, system-ui, sans-serif',
  mono: '"IBM Plex Mono", "SF Mono", monospace',
} as const;

export const FPS = 30;

export const SPRING = {
  snappy: { damping: 18, stiffness: 200, mass: 0.5 },
  smooth: { damping: 26, stiffness: 100, mass: 0.8 },
  bouncy: { damping: 12, stiffness: 170, mass: 0.6 },
  heavy:  { damping: 35, stiffness: 55,  mass: 1.2 },
} as const;

// 90 seconds = 2700 frames. Zero gaps.
export const S = {
  hook:      { from: 0,    dur: 210  },  // 0-7s     "$3.2B lost..."
  problem:   { from: 210,  dur: 210  },  // 7-14s    "Zero guardrails..."
  solution:  { from: 420,  dur: 240  },  // 14-22s   "Guards changes that..."
  wallet:    { from: 660,  dur: 150  },  // 22-27s   "Connect with Beexo..."
  dashboard: { from: 810,  dur: 240  },  // 27-35s   "Treasury at a glance..."
  risk:      { from: 1050, dur: 300  },  // 35-45s   "Six-stage risk ladder..."
  swap:      { from: 1350, dur: 300  },  // 45-55s   "Policy-gated swaps..."
  audit:     { from: 1650, dur: 300  },  // 55-65s   "Replay protection..."
  market:    { from: 1950, dur: 390  },  // 65-78s   "$12B TAM..."
  cta:       { from: 2340, dur: 360  },  // 78-90s   "Stop watching..."
} as const;
