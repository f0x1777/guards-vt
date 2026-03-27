"use client";

import { ArrowRight } from "lucide-react";
import { FadeUp } from "./animations";
import { WalletStatusChip } from "./wallet-status-chip";

export function CTASection() {
  return (
    <section className="relative py-32 bg-[#070612] overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, #7c6ff720 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
            Stop watching your treasury.
            <br />
            <span className="font-serif italic text-[#7c6ff7]">
              Start protecting it.
            </span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Define policy bounds once, then let the execution flow react automatically
            when the treasury breaches protected thresholds.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="mx-auto grid max-w-4xl gap-4 text-left md:grid-cols-2">
            <a
              href="/dashboard?entry=mock&section=overview"
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <p className="eyebrow">Open Demo</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                View with mock data
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                See the interface instantly with a seeded treasury, live market quotes,
                and a product-safe walkthrough of the full operating surface.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </div>
            </a>

            <a
              href="/dashboard?entry=connect&section=policy"
              className="rounded-[28px] border border-[#7c6ff7]/30 bg-[#7c6ff7]/10 p-6 transition hover:border-[#7c6ff7]/55 hover:bg-[#7c6ff7]/14"
            >
              <p className="eyebrow">Open Demo</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Connect wallet
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Connect an operator wallet, jump into the policy flow, and start
                shaping the treasury configuration from the real Rootstock surface.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Create treasury
                <ArrowRight className="h-4 w-4" />
              </div>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <WalletStatusChip />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
