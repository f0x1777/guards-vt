"use client";

import { FadeUp } from "./animations";

export function TrackBanner() {
  return (
    <section className="relative overflow-hidden bg-[#070612] py-16 md:py-20">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(124,111,247,0.24) 50%, transparent 90%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124,111,247,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center lg:px-12">
        <FadeUp>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.34em] text-white/35 md:text-sm">
            Adapting for
          </p>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold tracking-wide">
              Rootstock Track
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold tracking-wide text-[#7c6ff7]">
              Beexo Connect
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.16}>
          <p className="max-w-2xl text-sm leading-relaxed text-white/38 md:text-base">
            Same treasury-control product direction, now reframed for Bitcoin DeFi on Rootstock and frictionless
            wallet onboarding for LATAM users through Beexo Connect.
          </p>
        </FadeUp>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(124,111,247,0.14) 50%, transparent 90%)",
        }}
      />
    </section>
  );
}
