import type { Metadata } from "next";
import { PitchPlayer } from "./PitchPlayer";

export const metadata: Metadata = {
  title: "GUARDS | Pitch",
  description:
    "Guards — Treasury protection for Bitcoin DeFi on Rootstock. 90-second pitch.",
};

export default function PitchPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070612",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 32,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            color: "#7c6ff7",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontWeight: 600,
          }}
        >
          DoraHacks -- Rootstock Track
        </span>
        <h1
          style={{
            fontFamily: "Manrope, system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#f0eef8",
            margin: 0,
          }}
        >
          Guards Pitch
        </h1>
        <p
          style={{
            fontFamily: "Manrope, system-ui, sans-serif",
            fontSize: 14,
            color: "#9896aa",
            margin: 0,
          }}
        >
          Treasury protection for Bitcoin DeFi on Rootstock — 90s
        </p>
      </div>

      {/* Player */}
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <PitchPlayer />
      </div>

      {/* Footer links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {[
          { label: "Built on", name: "Rootstock" },
          { label: "Powered by", name: "Pyth" },
          { label: "Wallet by", name: "Beexo" },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 9,
                color: "#5e5c72",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              {p.label}
            </span>
            <span
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                fontSize: 13,
                color: "#9896aa",
                fontWeight: 600,
              }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
